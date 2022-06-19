// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Cars is Ownable, ERC721URIStorage {
  mapping(string => uint256) private serialNumberToCar;
  mapping(uint256 => uint256) private carToOdometer;

  uint256 private tokenIds;

  event Registered(uint256 carId, string serialNumber, uint256 odometer, string hash);
  event UpdateOdometer(uint256 carId, uint256 odometer);

  constructor() ERC721("CarFaxCars", "CFCa") {}

  function register(
    string memory _serialNumber,
    uint256 _odometer,
    string memory _hash
  ) external returns (uint256) {
    require(serialNumberToCar[_serialNumber] == 0, "Car already minted.");
    tokenIds++;
    super._mint(address(this), tokenIds);
    super._setTokenURI(tokenIds, _hash);
    serialNumberToCar[_serialNumber] = tokenIds;
    carToOdometer[tokenIds] = _odometer;
    emit Registered(tokenIds, _serialNumber, _odometer, _hash);
    return tokenIds;
  }

  //Manque de securite pour le moment vu que le token appartient a address(this)
  function updateOdometer(uint256 _carId, uint256 _odometer) external {
    super.ownerOf(_carId);
    carToOdometer[_carId] = _odometer;
    emit UpdateOdometer(_carId, _odometer);
  }

  function getTokenIds() external view returns (uint256) {
    return tokenIds;
  }

  function getOdometerFromCar(uint256 _carId) external view returns (uint256) {
    return carToOdometer[_carId];
  }

  function getOdometerFromSerialNumber(string memory _serialNumber) external view returns (uint256) {
    return carToOdometer[serialNumberToCar[_serialNumber]];
  }
}
