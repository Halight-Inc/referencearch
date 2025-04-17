export class ObjectExt {
    static exists(obj: never) {
        return obj !== undefined && obj !== null;
    }

    static checkArgument(condition: boolean, message: string) {
        if (!condition) {
            throw TypeError(message);
        }
    }

    static checkExists(obj: never, message: string) {
        if (ObjectExt.exists(obj)) {
            throw TypeError(message);
        }
    }
}
