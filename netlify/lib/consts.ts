export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Accept-Encoding, Authorization",
};

export const apiHeaders = {
    ...corsHeaders,
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, private",
};
