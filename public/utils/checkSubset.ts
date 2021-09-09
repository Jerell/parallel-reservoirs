export default function checkSubset(subArr: any[], superArr: any[]) {
	return subArr.every((elem) => superArr.includes(elem));
}
