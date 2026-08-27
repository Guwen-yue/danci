import postgres from "postgres";

const url = "postgresql://postgres.lzikvcevbkrfgbailxmu:supabase%40hwq3240@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres";
const sql = postgres(url, { max: 1, connect_timeout: 15 });
try {
  const users = await sql`select name, email, role, status, created_at from admin_users order by created_at`;
  console.log(JSON.stringify(users, null, 2));
} finally {
  await sql.end();
}
