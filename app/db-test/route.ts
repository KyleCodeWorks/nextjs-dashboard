import postgres from 'postgres';

// Create a connection using your Neon URL
const sql = postgres(process.env.POSTGRES_URL_NON_POOLING! || process.env.POSTGRES_PRISMA_URL!, {
  ssl: 'require',
});

export async function GET() {
  try {
    // Try a lightweight query
    const result = await sql`SELECT NOW() AS current_time;`;

    return Response.json({
      status: '✅ Connected to database successfully!',
      server_time: result[0].current_time,
      database_url_used:
        process.env.POSTGRES_URL_NON_POOLING
          ? 'POSTGRES_URL_NON_POOLING'
          : 'POSTGRES_PRISMA_URL',
    });
  } catch (error: any) {
    console.error('DB connection error:', error);
    return Response.json(
      {
        status: '❌ Failed to connect to database',
        message: error.message,
        hint: 'Likely a network/firewall issue if this works on mobile data but not company Wi-Fi.',
      },
      { status: 500 }
    );
  }
}
