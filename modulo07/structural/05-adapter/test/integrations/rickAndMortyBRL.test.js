import {  expect, describe, test, jest, beforeEach} from '@jest/globals'
import axios from 'axios'
import fs from 'fs/promises'
import RickAndMortyBRL from '../../src/business/integrations/rickAndMortyBRL'
import Character from '../../src/entities/character'

describe('#RickAndMortyBRL', () => {
    beforeEach(() => jest.clearAllMocks())

    test('#getCharatersJSON should return a list of Charater Entity', async () => {
        const response = JSON.parse(await fs.readFile('./test/mocks/characters.json'))
        const expected = response.results.map(char => new Character(char))
        jest.spyOn(axios, "get").mockResolvedValue({ data: response })

        const result = await RickAndMortyBRL.getCharactersFromJSON()
        expect(result).toStrictEqual(expected)

    })
    test('#getCharatersJSON should return an empty list if the API returns nothing', async () => {
        const response = JSON.parse(await fs.readFile('./test/mocks/characters-empty.json'))
        const expected = response.results
        jest.spyOn(axios, "get").mockResolvedValue({ data: response })

        const result = await RickAndMortyBRL.getCharactersFromJSON()
        expect(result).toStrictEqual(expected)

    })
})