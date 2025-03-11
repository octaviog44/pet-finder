const algoliasearch = require("algoliasearch");
require("dotenv").config();

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);

const index = client.initIndex("pets");

class AlgoliaService {
  static async indexPet(pet) {
    const [lat, lng] = pet.location.split(",").map(Number);
    return await index.saveObject({
      objectID: pet.id,
      name: pet.name,
      status: pet.status,
      _geoloc: {
        lat,
        lng,
      },
    });
  }

  static async updatePet(pet) {
    return await this.indexPet(pet);
  }

  static async deletePet(petId) {
    return await index.deleteObject(petId);
  }

  static async searchNearby(location, radius = 5000) {
    const [lat, lng] = location.split(",").map(Number);
    return await index.search("", {
      aroundLatLng: `${lat}, ${lng}`,
      aroundRadius: radius,
    });
  }
}

module.exports = AlgoliaService;
