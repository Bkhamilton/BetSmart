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

import { Game } from '../models/Game';
import { HttpFile } from '../http/http';

export class GameInfo {
    'league': string;
    'game': Game;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "league",
            "baseName": "league",
            "type": "string",
            "format": ""
        },
        {
            "name": "game",
            "baseName": "game",
            "type": "Game",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return GameInfo.attributeTypeMap;
    }

    public constructor() {
    }
}

