"use server";

import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin Client
// This bypasses RLS and allows administrative actions like updating passwords
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function resetPasswordWithSecurityAnswer(
  email: string,
  question: string,
  answer: string,
  newPassword: string
) {
  try {
    // Fetch users to find the one matching the email
    // Note: In a massive production app, you'd query a custom users table.
    // For this project, listing auth users is perfectly fine.
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    
    if (listError) throw listError;

    const user = users.find((u) => u.email === email);
    if (!user) {
      return { success: false, error: "Email tidak ditemukan." };
    }

    const meta = user.user_metadata;
    if (!meta || !meta.security_question || !meta.security_answer) {
      return { success: false, error: "Akun ini belum mengatur pertanyaan keamanan. Gunakan akun baru untuk mencoba fitur ini." };
    }

    // Verify question and answer (case insensitive)
    if (
      meta.security_question === question &&
      meta.security_answer.toLowerCase() === answer.toLowerCase()
    ) {
      // Update the user's password
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: newPassword
      });
      
      if (updateError) throw updateError;
      return { success: true };
    } else {
      return { success: false, error: "Pertanyaan atau jawaban keamanan salah." };
    }
  } catch (err: any) {
    return { success: false, error: err.message || "Terjadi kesalahan sistem." };
  }
}
