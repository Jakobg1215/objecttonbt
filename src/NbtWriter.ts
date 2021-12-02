import { Buffer } from 'node:buffer';
import { endianness } from 'node:os';
import { TagIds } from './TagIds';

export default class NbtWriter {
    private bytes: Buffer = Buffer.allocUnsafe(0);

    //#region TAGS

    public writeTagEnd(): this {
        return this.writeTagType(TagIds.END);
    }

    public writeTagByte(byte: number, name?: string | null): this {
        if (name !== null) {
            this.writeTagType(TagIds.BYTE).writeTagName(name ?? '');
        }
        this.bytes = Buffer.concat([this.bytes, Buffer.from(Int8Array.from([byte]).buffer)]);
        return this;
    }

    public writeTagShort(short: number, name?: string | null): this {
        if (name !== null) {
            this.writeTagType(TagIds.SHORT).writeTagName(name ?? '');
        }
        const buf: Buffer = Buffer.from(Int16Array.from([short]));
        if (endianness() === 'LE') buf.swap16();
        this.bytes = Buffer.concat([this.bytes, buf]);
        return this;
    }

    public writeTagInt(int: number, name?: string | null): this {
        if (name !== null) {
            this.writeTagType(TagIds.INT).writeTagName(name ?? '');
        }
        const buf: Buffer = Buffer.from(Int32Array.from([int]).buffer);
        if (endianness() === 'LE') buf.swap32();
        this.bytes = Buffer.concat([this.bytes, buf]);
        return this;
    }

    public writeTagLong(long: bigint, name?: string | null): this {
        if (name !== null) {
            this.writeTagType(TagIds.LONG).writeTagName(name ?? '');
        }
        const buf: Buffer = Buffer.from(BigInt64Array.from([long]).buffer);
        if (endianness() === 'LE') buf.swap64();
        this.bytes = Buffer.concat([this.bytes, buf]);
        return this;
    }

    public writeTagFloat(float: number, name?: string | null): this {
        if (name !== null) {
            this.writeTagType(TagIds.FLOAT).writeTagName(name ?? '');
        }
        const buf: Buffer = Buffer.from(Float32Array.from([float]).buffer);
        if (endianness() === 'LE') buf.swap32();
        this.bytes = Buffer.concat([this.bytes, buf]);
        return this;
    }

    public writeTagDouble(double: number, name?: string | null): this {
        if (name !== null) {
            this.writeTagType(TagIds.DOUBLE).writeTagName(name ?? '');
        }
        const buf: Buffer = Buffer.from(Float64Array.from([double]).buffer);
        if (endianness() === 'LE') buf.swap64();
        this.bytes = Buffer.concat([this.bytes, buf]);
        return this;
    }

    public writeTagByteArray(bytes: number[], name?: string | null): this {
        if (name !== null) {
            this.writeTagType(TagIds.BYTEARRAY).writeTagName(name ?? '');
        }
        this.writeSignedInteger(bytes.length);
        this.bytes = Buffer.concat([this.bytes, Buffer.from(Int8Array.from(bytes).buffer)]);
        return this;
    }

    public writeTagString(text: string, name?: string | null): this {
        if (name !== null) {
            this.writeTagType(TagIds.STRING).writeTagName(name ?? '');
        }
        return this.writeUnsignedShort(text.length).writeString(text);
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
        const buf: Buffer = Buffer.from(Int32Array.from(ints).buffer);
        if (endianness() === 'LE') buf.swap32();
        this.bytes = Buffer.concat([this.bytes, buf]);
        return this;
    }

    public writeTagLongArray(longs: bigint[], name?: string | null): this {
        if (name !== null) {
            this.writeTagType(TagIds.LONGARRAY).writeTagName(name ?? '');
        }
        this.writeSignedInteger(longs.length);
        const buf: Buffer = Buffer.from(BigInt64Array.from(longs).buffer);
        if (endianness() === 'LE') buf.swap64();
        this.bytes = Buffer.concat([this.bytes, buf]);
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
        this.bytes = Buffer.concat([this.bytes, Buffer.from(Uint8Array.from([byte]).buffer)]);
        return this;
    }

    private writeUnsignedShort(short: number): this {
        const buf: Buffer = Buffer.from(Uint16Array.from([short]).buffer);
        if (endianness() === 'LE') buf.swap16();
        this.bytes = Buffer.concat([this.bytes, buf]);
        return this;
    }

    private writeSignedInteger(integer: number): this {
        const buf: Buffer = Buffer.from(Int32Array.from([integer]).buffer);
        if (endianness() === 'LE') buf.swap32();
        this.bytes = Buffer.concat([this.bytes, buf]);
        return this;
    }

    //#endregion

    public get buffer(): Buffer {
        return this.bytes;
    }
}
