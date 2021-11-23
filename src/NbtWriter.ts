import { Buffer } from 'node:buffer';
import { TagIds } from './TagIds';

export default class NbtWriter {
    private bytes: Buffer = Buffer.alloc(0);

    //#region TAGS

    public writeTagEnd(): this {
        return this.writeTagType(TagIds.END);
    }

    public writeTagByte(byte: number, name?: string | null): this {
        if (name !== null) {
            this.writeTagType(TagIds.BYTE).writeTagName(name ?? '');
        }
        this.bytes = Buffer.concat([this.bytes, Buffer.from(new Int8Array([byte]).buffer)]);
        return this;
    }

    public writeTagShort(short: number, name?: string | null): this {
        if (name !== null) {
            this.writeTagType(TagIds.SHORT).writeTagName(name ?? '');
        }
        this.bytes = Buffer.concat([this.bytes, Buffer.from(new Int16Array([short]).buffer)]);
        return this;
    }

    public writeTagInt(int: number, name?: string | null): this {
        if (name !== null) {
            this.writeTagType(TagIds.INT).writeTagName(name ?? '');
        }
        this.bytes = Buffer.concat([this.bytes, Buffer.from(new Int32Array([int]).buffer)]);
        return this;
    }

    public writeTagLong(long: bigint, name?: string | null): this {
        if (name !== null) {
            this.writeTagType(TagIds.LONG).writeTagName(name ?? '');
        }
        this.bytes = Buffer.concat([this.bytes, Buffer.from(new BigInt64Array([long]).buffer)]);
        return this;
    }

    public writeTagFloat(float: number, name?: string | null): this {
        if (name !== null) {
            this.writeTagType(TagIds.FLOAT).writeTagName(name ?? '');
        }
        this.bytes = Buffer.concat([this.bytes, Buffer.from(new Float32Array([float]).buffer)]);
        return this;
    }

    public writeTagDouble(double: number, name?: string | null): this {
        if (name !== null) {
            this.writeTagType(TagIds.DOUBLE).writeTagName(name ?? '');
        }
        const tagData = Buffer.alloc(8);
        tagData.writeDoubleBE(double);
        this.bytes = Buffer.concat([this.bytes, Buffer.from(new Float64Array([double]).buffer)]);
        return this;
    }

    public writeTagByteArray(bytes: number[], name?: string | null): this {
        if (name !== null) {
            this.writeTagType(TagIds.BYTEARRAY).writeTagName(name ?? '');
        }
        this.writeSignedInteger(bytes.length);
        this.bytes = Buffer.concat([this.bytes, Buffer.from(new Int8Array(bytes).buffer)]);
        return this;
    }

    public writeTagString(string: string, name?: string | null): this {
        if (name !== null) {
            this.writeTagType(TagIds.STRING).writeTagName(name ?? '');
        }
        return this.writeUnsignedShort(string.length).writeString(string);
    }

    public writeTagList(type: TagIds, length: number, name?: string | null): this {
        if (name !== null) {
            this.writeTagType(TagIds.LIST).writeTagName(name ?? '');
        }
        return this.writeUnsignedByte(type).writeSignedInteger(length);
    }

    public writeTagCompound(name?: string | null): this {
        if (name !== null) {
            this.writeTagType(TagIds.COMPOUND).writeTagName(name ?? '');
        }
        return this;
    }

    public writeTagIntArray(ints: number[], name?: string | null): this {
        if (name !== null) {
            this.writeTagType(TagIds.INTARRAY).writeTagName(name ?? '');
        }
        this.writeSignedInteger(ints.length);
        this.bytes = Buffer.concat([this.bytes, Buffer.from(new Int32Array(ints).buffer)]);
        return this;
    }

    public writeTagLongArray(longs: bigint[], name?: string | null): this {
        if (name !== null) {
            this.writeTagType(TagIds.LONGARRAY).writeTagName(name ?? '');
        }
        this.writeSignedInteger(longs.length);
        this.bytes = Buffer.concat([this.bytes, Buffer.from(new BigInt64Array(longs).buffer)]);
        return this;
    }

    //#endregion

    //#region WRITERS

    private writeTagName(name: string): this {
        return this.writeUnsignedShort(name.length).writeString(name);
    }

    private writeTagType(tag: TagIds): this {
        return this.writeUnsignedByte(tag);
    }

    private writeString(text: string): this {
        this.bytes = Buffer.concat([this.bytes, Buffer.from(text, 'utf-8')]);
        return this;
    }

    private writeUnsignedByte(byte: number): this {
        this.bytes = Buffer.concat([this.bytes, Buffer.from(new Uint8Array([byte]).buffer)]);
        return this;
    }

    private writeUnsignedShort(short: number): this {
        this.bytes = Buffer.concat([this.bytes, Buffer.from(new Uint16Array([short]).buffer)]);
        return this;
    }

    private writeSignedInteger(integer: number): this {
        this.bytes = Buffer.concat([this.bytes, Buffer.from(new Int32Array([integer]))]);
        return this;
    }

    //#endregion

    public get buffer(): Buffer {
        return this.bytes;
    }
}
