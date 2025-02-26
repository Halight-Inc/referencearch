import { SplitIO } from '@splitsoftware/splitio';

declare global {
    namespace Express {
        interface Request {
            splitClient: SplitIO.IClient;
        }
    }
}