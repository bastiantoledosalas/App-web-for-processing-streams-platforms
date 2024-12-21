import * as fs from "fs";
import * as readline from "readline";
import { dispatchLine } from "./parsers";

export async function parseFile(filePath: string): Promise<any> {
    const context = {
        results     : [{
            arrivalRates: [],
            numberTuples: [],
            serviceTimes: [],
            processors  : [],
            nodes       : [],
            stadistics  : [],
        }],        
    };

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    try {
        for await (const line of rl) {
            if (line.trim()) {
                dispatchLine(line.trim(), context);
            }
        }
        return context;
    } catch (error) {
        console.error(`Error reading file: ${error.message}`);
        throw new Error('Failed to process the simulation file');
    }
}
