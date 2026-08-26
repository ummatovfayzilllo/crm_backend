const fs = require('fs');
const readline = require('readline');

async function recover() {
    const fileStream = fs.createReadStream('/home/fayzillo/.gemini/antigravity-cli/brain/d34969a9-910e-4045-bfba-0195a2a70786/.system_generated/logs/transcript_full.jsonl');
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    let latestCode = null;
    
    for await (const line of rl) {
        try {
            const parsed = JSON.parse(line);
            if (parsed.tool_calls) {
                for (const call of parsed.tool_calls) {
                    if (call.function.name === 'default_api:write_to_file' || call.function.name === 'default_api:replace_file_content') {
                        const args = JSON.parse(call.function.arguments);
                        if (args.TargetFile && args.TargetFile.endsWith('auth.service.ts')) {
                            if (args.CodeContent) latestCode = args.CodeContent;
                        }
                    }
                }
            }
        } catch(e) {}
    }
    
    if (latestCode) {
        fs.writeFileSync('src/core/auth/auth.service.ts', latestCode);
        console.log("Recovered auth.service.ts!");
    } else {
        console.log("Not found CodeContent");
    }
}
recover();
