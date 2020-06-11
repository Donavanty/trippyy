export const updateObject = (oldObject, updatedProperties) => {
	return {
		...oldObject,
		...updatedProperties
	}
}
//Takes in oldObject, replaces the properties
