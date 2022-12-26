import { expect, describe, test, jest, beforeEach } from '@jest/globals'
import RickAndMortyBRLAdapter from '../../src/business/adapters/rickAndMortyBRLAdapter'
import RickAndMortyBRL from '../../src/business/integrations/rickAndMortyBRL'


describe('#RickAndMortyBRLAdapter', () => {
    beforeEach(() => jest.clearAllMocks())
    test('#getCharaters should be an adapter for RickAndMortyBRL.getCharatersJSON', async () => {
        const brlIntegration = jest.spyOn(
            RickAndMortyBRL, 
            RickAndMortyBRL.getCharactersFromJSON.name
        ).mockResolvedValue([])

        const result = await RickAndMortyBRLAdapter.getCharaters()
        expect(result).toEqual([])
        
        expect(brlIntegration).toHaveBeenCalled()
    })
})