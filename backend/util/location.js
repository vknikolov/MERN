const getCordinatesForAddress = async (address) => {
  // Simulate an asynchronous operation to get coordinates
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Dummy coordinates for the sake of example
      const coordinates = {
        lat: 40.7484474,
        lng: -73.9871516,
      };
      resolve(coordinates);
    }, 1000);
  });
};

module.exports = getCordinatesForAddress;