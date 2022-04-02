import type { Buffer } from 'node:buffer';
import { isBigInt64Array, isInt32Array, isInt8Array } from 'node:util/types';
import NbtWriter from './NbtWriter';
import { TagIds } from './TagIds';

export default function objectToNbt(objectData: object): Buffer {
    const elements = Object.entries(objectData);
    const nbtData = new NbtWriter();

    nbtData.writeTagCompound();

    function writeList(listData: any[], listName?: string | null): void {
        switch (typeof listData[0]) {
            case 'bigint': {
                nbtData.writeTagList(TagIds.LONG, listData.length, listName);
                listData.forEach((element) => nbtData.writeTagLong(element, null));
                break;
            }

            case 'boolean': {
                nbtData.writeTagList(TagIds.BYTE, listData.length, listName);
                listData.forEach((element) => nbtData.writeTagByte(element ? 1 : 0, null));
                break;
            }

            case 'number': {
                if (!Number.isInteger(listData[0])) {
                    nbtData.writeTagList(TagIds.FLOAT, listData.length, listName);
                    listData.forEach((element) => nbtData.writeTagFloat(element, null));
                    break;
                }

                nbtData.writeTagList(TagIds.INT, listData.length, listName);
                listData.forEach((element) => nbtData.writeTagInt(element, null));
                break;
            }

            case 'object': {
                if (Array.isArray(listData[0])) {
                    nbtData.writeTagList(TagIds.LIST, listData.length, listName);
                    listData.forEach((element) => writeList(element, null));
                    break;
                }

                if (listData[0] === null) {
                    nbtData.writeTagList(TagIds.INT, listData.length, listName);
                    listData.forEach((_element) => nbtData.writeTagInt(0, null));
                    break;
                }

                if (isInt8Array(listData[0])) {
                    nbtData.writeTagList(TagIds.BYTEARRAY, listData.length, listName);
                    listData.forEach((element) => nbtData.writeTagByteArray(element, null));
                    break;
                }

                if (isInt32Array(listData[0])) {
                    nbtData.writeTagList(TagIds.INTARRAY, listData.length, listName);
                    listData.forEach((element) => nbtData.writeTagIntArray(element, null));
                    break;
                }

                if (isBigInt64Array(listData[0])) {
                    nbtData.writeTagList(TagIds.LONGARRAY, listData.length, listName);
                    listData.forEach((element) => nbtData.writeTagLongArray(element, null));
                    break;
                }

                nbtData.writeTagList(TagIds.COMPOUND, listData.length, listName);
                listData.forEach((element) => writeCompound(element));
                break;
            }

            case 'string': {
                if (listData[0].match(/[bslfd]/)) {
                    if (listData[0].slice(0, -1).match(/^[0-9.-]*$/)) {
                        switch (listData[0].slice(1)) {
                            case 'b': {
                                nbtData.writeTagList(TagIds.BYTE, listData.length, listName);
                                listData.forEach((element) =>
                                    nbtData.writeTagByte(parseInt(element.slice(0, -1)), null),
                                );
                                break;
                            }

                            case 's': {
                                nbtData.writeTagList(TagIds.SHORT, listData.length, listName);
                                listData.forEach((element) =>
                                    nbtData.writeTagShort(parseInt(element.slice(0, -1)), null),
                                );
                                break;
                            }

                            case 'l': {
                                nbtData.writeTagList(TagIds.LONG, listData.length, listName);
                                listData.forEach((element) => nbtData.writeTagLong(BigInt(element.slice(0, -1)), null));
                                break;
                            }

                            case 'f': {
                                nbtData.writeTagList(TagIds.FLOAT, listData.length, listName);
                                listData.forEach((element) =>
                                    nbtData.writeTagFloat(parseFloat(element.slice(0, -1)), null),
                                );
                                break;
                            }

                            case 'd': {
                                nbtData.writeTagList(TagIds.DOUBLE, listData.length, listName);
                                listData.forEach((element) =>
                                    nbtData.writeTagDouble(parseFloat(element.slice(0, -1)), null),
                                );
                                break;
                            }

                            default: {
                                nbtData.writeTagList(TagIds.INT, listData.length, listName);
                                listData.forEach((_element) => nbtData.writeTagInt(0, null));
                            }
                        }
                        break;
                    }
                }
                nbtData.writeTagList(TagIds.STRING, listData.length, listName);
                listData.forEach((element) => nbtData.writeTagString(element, null));
                break;
            }

            default: {
                nbtData.writeTagList(TagIds.INT, listData.length, listName);
                listData.forEach((_element) => nbtData.writeTagInt(0, null));
                break;
            }
        }
    }

    function writeCompound(compoundData: object): void {
        const compoundElements = Object.entries(compoundData);

        for (const [name, data] of compoundElements) {
            switch (typeof data) {
                case 'bigint': {
                    nbtData.writeTagLong(data, name);
                    break;
                }

                case 'boolean': {
                    nbtData.writeTagByte(data ? 1 : 0, name);
                    break;
                }

                case 'number': {
                    if (!Number.isInteger(data)) {
                        nbtData.writeTagFloat(data, name);
                        break;
                    }

                    nbtData.writeTagInt(data, name);
                    break;
                }

                case 'object': {
                    if (Array.isArray(data)) {
                        writeList(data, name);
                        break;
                    }

                    if (data === null) {
                        nbtData.writeTagInt(0, name);
                        break;
                    }

                    if (isInt8Array(data)) {
                        nbtData.writeTagByteArray(data, name);
                        break;
                    }

                    if (isInt32Array(data)) {
                        nbtData.writeTagIntArray(data, name);
                        break;
                    }

                    if (isBigInt64Array(data)) {
                        nbtData.writeTagLongArray(data, name);
                        break;
                    }

                    nbtData.writeTagCompound(name);
                    writeCompound(data);

                    break;
                }

                case 'string': {
                    if (data.match(/[bslfd]/)) {
                        if (data.slice(0, -1).match(/^[0-9.-]*$/)) {
                            switch (data.slice(-1)) {
                                case 'b': {
                                    nbtData.writeTagByte(parseInt(data.slice(0, -1)), name);
                                    break;
                                }

                                case 's': {
                                    nbtData.writeTagShort(parseInt(data.slice(0, -1)), name);
                                    break;
                                }

                                case 'l': {
                                    nbtData.writeTagLong(BigInt(data.slice(0, -1)), name);
                                    break;
                                }

                                case 'f': {
                                    nbtData.writeTagFloat(parseFloat(data.slice(0, -1)), name);
                                    break;
                                }

                                case 'd': {
                                    nbtData.writeTagDouble(parseFloat(data.slice(0, -1)), name);
                                    break;
                                }

                                default: {
                                    nbtData.writeTagInt(0, name);
                                }
                            }
                            break;
                        }
                    }
                    nbtData.writeTagString(data, name);
                    break;
                }

                default: {
                    nbtData.writeTagInt(0, name);
                    break;
                }
            }
        }

        nbtData.writeTagEnd();
    }

    for (const [name, data] of elements) {
        switch (typeof data) {
            case 'bigint': {
                nbtData.writeTagLong(data, name);
                break;
            }

            case 'boolean': {
                nbtData.writeTagByte(data ? 1 : 0, name);
                break;
            }

            case 'number': {
                if (!Number.isInteger(data)) {
                    nbtData.writeTagFloat(data, name);
                    break;
                }

                nbtData.writeTagInt(data, name);
                break;
            }

            case 'object': {
                if (Array.isArray(data)) {
                    writeList(data, name);
                    break;
                }

                if (data === null) {
                    nbtData.writeTagInt(0, name);
                    break;
                }

                if (isInt8Array(data)) {
                    nbtData.writeTagByteArray(data, name);
                    break;
                }

                if (isInt32Array(data)) {
                    nbtData.writeTagIntArray(data, name);
                    break;
                }

                if (isBigInt64Array(data)) {
                    nbtData.writeTagLongArray(data, name);
                    break;
                }

                nbtData.writeTagCompound(name);
                writeCompound(data);

                break;
            }

            case 'string': {
                if (data.match(/[bslfd]/)) {
                    if (data.slice(0, -1).match(/^[0-9.-]*$/)) {
                        switch (data.slice(-1)) {
                            case 'b': {
                                nbtData.writeTagByte(parseInt(data.slice(0, -1)), name);
                                break;
                            }

                            case 's': {
                                nbtData.writeTagShort(parseInt(data.slice(0, -1)), name);
                                break;
                            }

                            case 'l': {
                                nbtData.writeTagLong(BigInt(data.slice(0, -1)), name);
                                break;
                            }

                            case 'f': {
                                nbtData.writeTagFloat(parseFloat(data.slice(0, -1)), name);
                                break;
                            }

                            case 'd': {
                                nbtData.writeTagDouble(parseFloat(data.slice(0, -1)), name);
                                break;
                            }

                            default: {
                                nbtData.writeTagInt(0, name);
                            }
                        }
                        break;
                    }
                }
                nbtData.writeTagString(data, name);
                break;
            }

            default: {
                nbtData.writeTagInt(0, name);
                break;
            }
        }
    }

    nbtData.writeTagEnd();

    return nbtData.bytes;
}
