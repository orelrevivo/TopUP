const expires = new Date(0).toUTCString();

export async function POST() {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0; Expires=${expires}`,
    },
  });
}
