// react-select-country-list.d.ts
declare module "react-select-country-list" {
  type Country = { label: string; value: string };

  function countryList(): {
    getData: () => Country[];
  };

  export default countryList;
}
