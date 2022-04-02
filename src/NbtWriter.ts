import { Buffer } from 'node:buffer';
import { endianness } from 'node:os';
import { TagIds } from './TagIds';

export default class NbtWriter {
    /** The raw data */
    public bytes = Buffer.allocUnsafe(0);

    /** This writes a tag to signify the end of a compound */
    public writeTagEnd(): this {
        return this.writeTagType(TagIds.END);
    }

    /**
     * Writes an unnamed byte tag
     * @param byte A number between -128 to 127
     */
    public writeTagByte(byte: number): this;
    /**
     * Writes a named byte tag
     * @param byte A number between -128 to 127
     * @param name A string with the max length of 65535
     */
    public writeTagByte(byte: number, name: string): this;
    /**
     * Writes a byte tag with no name
     * @param byte A number between -128 to 127
     * @param name Null is to specify that it is in a list
     * @param name A string with the max length of 65535
     */
    public writeTagByte(byte: number, name: null): this;
    public writeTagByte(byte: number, name?: string | null): this;
    public writeTagByte(byte: number, name: string | null = ''): this {
        if (name !== null) {
            this.writeTagType(TagIds.BYTE).writeTagName(name);
        }
        this.bytes = Buffer.concat([this.bytes, Buffer.from(Int8Array.from([byte]).buffer)]);
        return this;
    }

    /**
     * Writes an unnamed short tag
     * @param short A number between -32768 to 32767
     */
    public writeTagShort(short: number): this;
    /**
     * Writes a named short tag
     * @param short A number between -32768 to 32767
     * @param name A string with the max length of 65535
     */
    public writeTagShort(short: number, name: string): this;
    /**
     * Writes a short tag with no name
     * @param short A number between -32768 to 32767
     * @param name Null is to specify that it is in a list
     */
    public writeTagShort(short: number, name: null): this;
    public writeTagShort(short: number, name?: string | null): this;
    public writeTagShort(short: number, name: string | null = ''): this {
        if (name !== null) {
            this.writeTagType(TagIds.SHORT).writeTagName(name);
        }
        const buf = Buffer.from(Int16Array.from([short]).buffer);
        if (endianness() === 'LE') buf.swap16();
        this.bytes = Buffer.concat([this.bytes, buf]);
        return this;
    }

    /**
     * Writes an unnamed int tag
     * @param int A number between -2147483648 to 2147483647
     */
    public writeTagInt(int: number): this;
    /**
     * Writes a named int tag
     * @param int A number between -2147483648 to 2147483647
     * @param name A string with the max length of 65535
     */
    public writeTagInt(int: number, name: string): this;
    /**
     * Writes a int tag with no name
     * @param int A number between -2147483648 to 2147483647
     * @param name Null is to specify that it is in a list
     */
    public writeTagInt(int: number, name: null): this;
    public writeTagInt(int: number, name?: string | null): this;
    public writeTagInt(int: number, name: string | null = ''): this {
        if (name !== null) {
            this.writeTagType(TagIds.INT).writeTagName(name);
        }
        const buf = Buffer.from(Int32Array.from([int]).buffer);
        if (endianness() === 'LE') buf.swap32();
        this.bytes = Buffer.concat([this.bytes, buf]);
        return this;
    }

    /**
     * Writes an unnamed long tag
     * @param long A number between -9223372036854775808 to 9223372036854775807
     */
    public writeTagLong(long: bigint): this;
    /**
     * Writes a named long tag
     * @param long A number between -9223372036854775808 to 9223372036854775807
     * @param name A string with the max length of 65535
     */
    public writeTagLong(long: bigint, name: string): this;
    /**
     * Writes a long tag with no name
     * @param long A number between -9223372036854775808 to 9223372036854775807
     * @param name Null is to specify that it is in a list
     */
    public writeTagLong(long: bigint, name: null): this;
    public writeTagLong(long: bigint, name?: string | null): this;
    public writeTagLong(long: bigint, name: string | null = ''): this {
        if (name !== null) {
            this.writeTagType(TagIds.LONG).writeTagName(name);
        }
        const buf = Buffer.from(BigInt64Array.from([long]).buffer);
        if (endianness() === 'LE') buf.swap64();
        this.bytes = Buffer.concat([this.bytes, buf]);
        return this;
    }

    /**
     * Writes an unnamed float tag
     * @param float A number between 1.175494351E-38 to 3.402823466E+38
     */
    public writeTagFloat(float: number): this;
    /**
     * Writes a named float tag
     * @param float A number between 1.175494351E-38 to 3.402823466E+38
     * @param name A string with the max length of 65535
     */
    public writeTagFloat(float: number, name: string): this;
    /**
     * Writes a float tag with no name
     * @param float A number between 1.175494351E-38 to 3.402823466E+38
     * @param name Null is to specify that it is in a list
     */
    public writeTagFloat(float: number, name: null): this;
    public writeTagFloat(float: number, name?: string | null): this;
    public writeTagFloat(float: number, name: string | null = ''): this {
        if (name !== null) {
            this.writeTagType(TagIds.FLOAT).writeTagName(name);
        }
        const buf = Buffer.from(Float32Array.from([float]).buffer);
        if (endianness() === 'LE') buf.swap32();
        this.bytes = Buffer.concat([this.bytes, buf]);
        return this;
    }

    /**
     * Writes an unnamed double tag
     * @param double A number between 2.2250738585072014E-308 to 1.7976931348623158E+308
     */
    public writeTagDouble(double: number): this;
    /**
     * Writes a named double tag
     * @param double A number between 2.2250738585072014E-308 to 1.7976931348623158E+308
     * @param name A string with the max length of 65535
     */
    public writeTagDouble(double: number, name: string): this;
    /**
     * Writes a double tag with no name
     * @param double A number between 2.2250738585072014E-308 to 1.7976931348623158E+308
     * @param name Null is to specify that it is in a list
     */
    public writeTagDouble(double: number, name: null): this;
    public writeTagDouble(double: number, name?: string | null): this;
    public writeTagDouble(double: number, name: string | null = ''): this {
        if (name !== null) {
            this.writeTagType(TagIds.DOUBLE).writeTagName(name);
        }
        const buf = Buffer.from(Float64Array.from([double]).buffer);
        if (endianness() === 'LE') buf.swap64();
        this.bytes = Buffer.concat([this.bytes, buf]);
        return this;
    }

    /**
     * Writes an unnamed byte array tag
     * @param bytes A a int 8 array with the max length of 2147483647
     */
    public writeTagByteArray(bytes: Int8Array): this;
    /**
     * Writes an unnamed byte array tag
     * @param bytes A a int 8 array with the max length of 2147483647
     * @param name A string with the max length of 65535
     */
    public writeTagByteArray(bytes: Int8Array, name: string): this;
    /**
     * Writes an unnamed byte array tag
     * @param bytes A a int 8 array with the max length of 2147483647
     * @param name Null is to specify that it is in a list
     */
    public writeTagByteArray(bytes: Int8Array, name: null): this;
    public writeTagByteArray(bytes: Int8Array, name?: string | null): this;
    public writeTagByteArray(bytes: Int8Array, name: string | null = ''): this {
        if (name !== null) {
            this.writeTagType(TagIds.BYTEARRAY).writeTagName(name);
        }
        this.writeSignedInteger(bytes.length);
        this.bytes = Buffer.concat([this.bytes, Buffer.from(bytes.buffer)]);
        return this;
    }

    /**
     * Writes an unnamed string tag
     * @param text A string with the max length of 65535
     */
    public writeTagString(text: string): this;
    /**
     * Writes a named sting tag
     * @param text A string with the max length of 65535
     * @param name A string with the max length of 65535
     */
    public writeTagString(text: string, name: string): this;
    /**
     * Writes a string tag with no name
     * @param text A string with the max length of 65535
     * @param name Null is to specify that it is in a list
     */
    public writeTagString(text: string, name: null): this;
    public writeTagString(text: string, name?: string | null): this;
    public writeTagString(text: string, name: string | null = ''): this {
        if (name !== null) {
            this.writeTagType(TagIds.STRING).writeTagName(name);
        }
        return this.writeUnsignedShort(Buffer.byteLength(text)).writeString(text);
    }

    /**
     * Writes a unnamed list tag
     * @param type The type what the list is
     * @param length A list of tags with the max length of 2147483647
     */
    public writeTagList(type: TagIds, length: number): this;
    /**
     * Writes a named list tag
     * @param type The type what the list is
     * @param length A list of tags with the max length of 2147483647
     * @param name A string with the max length of 65535
     */
    public writeTagList(type: TagIds, length: number, name: string): this;
    /**
     * Writes a unnamed list tag
     * @param type The type what the list is
     * @param length A list of tags with the max length of 2147483647
     * @param name Null is to specify that it is in a list
     */
    public writeTagList(type: TagIds, length: number, name: null): this;
    public writeTagList(type: TagIds, length: number, name?: string | null): this;
    public writeTagList(type: TagIds, length: number, name: string | null = ''): this {
        if (name !== null) {
            this.writeTagType(TagIds.LIST).writeTagName(name);
        }
        return this.writeUnsignedByte(type).writeSignedInteger(length);
    }

    /** Writes an unnamed compound tag */
    public writeTagCompound(): this;
    /**
     * Writes a named compound tag
     * @param name A string with the max length of 65535
     */
    public writeTagCompound(name: string): this;
    /**
     * Writes a named compound tag
     * @param name Null is to specify that it is in a list
     */
    public writeTagCompound(name: null): this;
    public writeTagCompound(name?: string | null): this;
    public writeTagCompound(name: string | null = ''): this {
        if (name !== null) {
            this.writeTagType(TagIds.COMPOUND).writeTagName(name);
        }
        return this;
    }

    /**
     * Writes an unnamed int array tag
     * @param ints A a int 32 array with the max length of 2147483647
     */
    public writeTagIntArray(ints: Int32Array): this;
    /**
     * Writes an unnamed int array tag
     * @param ints A a int 32 array with the max length of 2147483647
     * @param name A string with the max length of 65535
     */
    public writeTagIntArray(ints: Int32Array, name: string): this;
    /**
     * Writes an unnamed int array tag
     * @param ints A a int 32 array with the max length of 2147483647
     * @param name Null is to specify that it is in a list
     */
    public writeTagIntArray(ints: Int32Array, name: null): this;
    public writeTagIntArray(ints: Int32Array, name?: string | null): this;
    public writeTagIntArray(ints: Int32Array, name: string | null = ''): this {
        if (name !== null) {
            this.writeTagType(TagIds.INTARRAY).writeTagName(name);
        }
        this.writeSignedInteger(ints.length);
        const buf = Buffer.from(ints.buffer);
        if (endianness() === 'LE') buf.swap32();
        this.bytes = Buffer.concat([this.bytes, buf]);
        return this;
    }

    /**
     * Writes an unnamed long array tag
     * @param longs A a big int 64 array with the max length of 2147483647
     */
    public writeTagLongArray(longs: BigInt64Array): this;
    /**
     * Writes an unnamed int array tag
     * @param longs A a big int 64 array with the max length of 2147483647
     * @param name A string with the max length of 65535
     */
    public writeTagLongArray(longs: BigInt64Array, name: string): this;
    /**
     * Writes an unnamed int array tag
     * @param longs A a big int 64 array with the max length of 2147483647
     * @param name Null is to specify that it is in a list
     */
    public writeTagLongArray(longs: BigInt64Array, name: null): this;
    public writeTagLongArray(longs: BigInt64Array, name?: string | null): this;
    public writeTagLongArray(longs: BigInt64Array, name: string | null = ''): this {
        if (name !== null) {
            this.writeTagType(TagIds.LONGARRAY).writeTagName(name);
        }
        this.writeSignedInteger(longs.length);
        const buf = Buffer.from(longs.buffer);
        if (endianness() === 'LE') buf.swap64();
        this.bytes = Buffer.concat([this.bytes, buf]);
        return this;
    }

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
        const buf = Buffer.from(Uint16Array.from([short]).buffer);
        if (endianness() === 'LE') buf.swap16();
        this.bytes = Buffer.concat([this.bytes, buf]);
        return this;
    }

    private writeSignedInteger(integer: number): this {
        const buf = Buffer.from(Int32Array.from([integer]).buffer);
        if (endianness() === 'LE') buf.swap32();
        this.bytes = Buffer.concat([this.bytes, buf]);
        return this;
    }
}
