import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { username, email, password, phoneNumber, address, role } = req.body;

    // Perform server-side validation if needed
    if (!username || !email || !password || !phoneNumber || !address || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { user } = data;

    // Save the additional user data in your database
    const { error: insertError } = await supabase.from("user").insert([
      {
        user_id: user?.id,
        username,
        email,
        password: password, // Assuming you want to store the password hash
        mobile_number: phoneNumber,
        address,
        role,
        created_at: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      return res.status(400).json({ error: insertError.message });
    }

    return res.status(200).json({ message: "User signed up successfully" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
