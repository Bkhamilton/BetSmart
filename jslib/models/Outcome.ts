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

import { HttpFile } from '../http/http';

export class Outcome {
    'timestamp': string;
    'handicap': number;
    'odds': number;
    'participant'?: number;
    'participantName'?: string;
    'name': string;
    'description': string;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "timestamp",
            "baseName": "timestamp",
            "type": "string",
            "format": ""
        },
        {
            "name": "handicap",
            "baseName": "handicap",
            "type": "number",
            "format": ""
        },
        {
            "name": "odds",
            "baseName": "odds",
            "type": "number",
            "format": ""
        },
        {
            "name": "participant",
            "baseName": "participant",
            "type": "number",
            "format": ""
        },
        {
            "name": "participantName",
            "baseName": "participant_name",
            "type": "string",
            "format": ""
        },
        {
            "name": "name",
            "baseName": "name",
            "type": "string",
            "format": ""
        },
        {
            "name": "description",
            "baseName": "description",
            "type": "string",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return Outcome.attributeTypeMap;
    }

    public constructor() {
    }
}
