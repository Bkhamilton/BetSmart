/**
 * Prop Odds API
 *  The Prop Odds API allows you to query player and game prop odds from different bookies. 
 *
 * OpenAPI spec version: 0.9
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { BookMarket } from '../models/BookMarket';
import { HttpFile } from '../http/http';

export class SportsBook {
    'bookieKey': string;
    'market': BookMarket;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "bookieKey",
            "baseName": "bookie_key",
            "type": "string",
            "format": ""
        },
        {
            "name": "market",
            "baseName": "market",
            "type": "BookMarket",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return SportsBook.attributeTypeMap;
    }

    public constructor() {
    }
}

