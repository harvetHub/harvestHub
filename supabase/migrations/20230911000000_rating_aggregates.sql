-- Create aggregate table first
CREATE TABLE IF NOT EXISTS product_rating_aggregates (
  product_id bigint PRIMARY KEY REFERENCES products(product_id),
  count_1 int NOT NULL DEFAULT 0,
  count_2 int NOT NULL DEFAULT 0,
  count_3 int NOT NULL DEFAULT 0,
  count_4 int NOT NULL DEFAULT 0,
  count_5 int NOT NULL DEFAULT 0,
  total_count int NOT NULL DEFAULT 0,
  median numeric(3,2) DEFAULT NULL,
  average numeric(5,2) DEFAULT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Create the compute function
CREATE OR REPLACE FUNCTION compute_and_set_rating_stats(p_product_id bigint) 
RETURNS void LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count_1 int;
  v_count_2 int;
  v_count_3 int;
  v_count_4 int;
  v_count_5 int;
  v_total_count int;
  v_median numeric(3,2);
  v_average numeric(5,2);
BEGIN
  -- Changed product_reviews to reviews to match your table name
  SELECT
    COUNT(*) FILTER (WHERE rating = 1),
    COUNT(*) FILTER (WHERE rating = 2),
    COUNT(*) FILTER (WHERE rating = 3),
    COUNT(*) FILTER (WHERE rating = 4),
    COUNT(*) FILTER (WHERE rating = 5),
    COUNT(*),
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY rating),
    AVG(rating)
  INTO 
    v_count_1, v_count_2, v_count_3, v_count_4, v_count_5,
    v_total_count, v_median, v_average
  FROM reviews  -- Changed from product_reviews to reviews
  WHERE product_id = p_product_id;

  -- Update the aggregate table
  INSERT INTO product_rating_aggregates (
    product_id, count_1, count_2, count_3, count_4, count_5, 
    total_count, median, average, updated_at
  )
  VALUES (
    p_product_id, v_count_1, v_count_2, v_count_3, v_count_4, v_count_5,
    v_total_count, v_median, v_average, now()
  )
  ON CONFLICT (product_id) DO UPDATE SET
    count_1 = EXCLUDED.count_1,
    count_2 = EXCLUDED.count_2,
    count_3 = EXCLUDED.count_3,
    count_4 = EXCLUDED.count_4,
    count_5 = EXCLUDED.count_5,
    total_count = EXCLUDED.total_count,
    median = EXCLUDED.median,
    average = EXCLUDED.average,
    updated_at = now();
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION compute_and_set_rating_stats TO authenticated;

-- Create trigger function
CREATE OR REPLACE FUNCTION trg_after_review_changes()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM compute_and_set_rating_stats(
    CASE
      WHEN TG_OP = 'DELETE' THEN OLD.product_id
      ELSE NEW.product_id
    END
  );
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that fires for INSERT, UPDATE, and DELETE
DROP TRIGGER IF EXISTS trg_after_review_changes ON reviews;
CREATE TRIGGER trg_after_review_changes
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION trg_after_review_changes();

-- Initialize existing data
INSERT INTO product_rating_aggregates (product_id)
SELECT DISTINCT product_id FROM reviews
ON CONFLICT (product_id) DO NOTHING;

-- Update initial aggregates
SELECT compute_and_set_rating_stats(product_id) 
FROM (SELECT DISTINCT product_id FROM reviews) r;