import { FC } from "react";
// import { useRouter } from "next/router";

// import { SearchContext } from "../../context/SearchContext";
// import Button from "../Button";

const SearchForm: FC = () => {
  //   const router = useRouter();
  //   const text = useContext(SearchContext);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.currentTarget.value);
    // useContext({ term: "" });

    // router.push("/search");
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* <input value={text} type="search" /> */}
      <button type="submit">Submit</button>
      {/* <Button label="Submit">Submit</Button> */}
    </form>
  );
};

export default SearchForm;
