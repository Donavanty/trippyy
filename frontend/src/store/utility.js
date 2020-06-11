export const updateObject = (oldObject, updatedProperties) => {
	return {
		...oldObject,
		...updatedProperties
	}
}
//Takes in oldObject, replaces the properties

export const recommendTime = (place) => {
	if (place.types.includes("amusement_park")) {
		return [360, "amusement_park"];
	} else if (place.types.includes("zoo")) {
		return [360, "zoo"];
	} else if (place.types.includes("shopping_mall"))  {
		return [240, "shopping_mall"];
	} else if (place.types.includes("museum")) {
		return [180, "museum"];
	} else if (place.types.includes("park")) {
		return [120, "park"];
	} else if (place.types.includes("hindu_temple")) {
		return [120, "hindu_temple"]
	} else if (place.types.includes("church")) {
		return [120, "church"]
	} else {
		return 120;
	}
}