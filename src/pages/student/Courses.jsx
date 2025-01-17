import React, { useState } from "react";
import Navbar from "../../components/StudentComponent/Navbar";
import Footer from "../../components/StudentComponent/Footer";
import SingleCourse from "../../components/StudentComponent/SingleCourse";
import { useQuery } from "@tanstack/react-query";
import CardSkeleton from "../../components/common/utils/CardSkeleton";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getCourses, getCategory } from "../../api/studentApi";

const Courses = () => {
  const [category, setCategory] = useState("default");
  const [search, setSearch] = useState("");

  const { data: categoryData = [] } = useQuery({
    queryKey: ["category"],
    queryFn: () => getCategory(),
    refetchOnWindowFocus: false,
  });

  const {
    data: courses = [],
    isLoading: coursesLoading,
    refetch,
  } = useQuery({
    queryKey: ["courses", category, search],
    queryFn: () => getCourses(category, search),
  });

  const searchInputRef = React.useRef(null);

  const handleSelect = (e) => {
    setCategory(e.target.value);
    setSearch("");
    refetch();
  };

  const handleChange = () => {
    handleSearch();
  };

  const handleSearch = async () => {
    const searchTerm = searchInputRef.current?.value;
    if (searchTerm) {
      setSearch(searchTerm);
    } else {
      refetch();
    }
  };

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = courses?.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar />
      <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16">
        <div className="mt-3 w-full flex flex-col md:flex-row justify-between items-center gap-5">
          <h1 className="animate-fade-right p-6 font-bold text-2xl">
            All Courses
          </h1>
          <div className="flex justify-between animate-fade-down">
            <div className="flex mr-4 ">
              <input
                type="search"
                ref={searchInputRef}
                onChange={handleChange}
                placeholder="Enter something..."
                className=" w-full md:w-80 px-3 h-10 rounded-l border-2 border-green-600 focus:outline-none focus:border-green-500"
              />
              <button
                type="submit"
                className="bg-green-600 text-white rounded-r px-2 md:px-3 py-0 md:py-1"
              >
                Search
              </button>
            </div>
            <div className="animate-fade-down flex md:flex-row gap-4 items-center">
              <select
                name="selectCategory"
                id="selectCategory"
                onChange={(e) => handleSelect(e)}
                className="w-full h-10 border-2 border-green-600 focus:outline-none focus:border-green-600 text-green-600 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider hover:bg-green-600 hover:text-white"
              >
                <option value="default">All categories</option>
                {categoryData?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {!coursesLoading && currentCourses?.length == 0 && (
          <div className=" h-5 flex flex-col items-center justify-center mt-36 animate-fade mb-52 ">
            <img className="w-30 h-40" src="/images/empty_data.png" alt="" />
            <h1 className="font-semibold text-lg text-center">
              No Courses found. :(
            </h1>
          </div>
        )}

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4 gap-10 animate-fade  ">
          {coursesLoading && (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          )}

          {/* Render current courses */}
          {currentCourses?.map((course, index) => (
            <SingleCourse key={index} course={course} />
          ))}
        </div>

        {/* Pagination */}

        {itemsPerPage < courses.length && (
          <div className="flex justify-center mt-8 ">
            <div className="flex items-center gap-4 mt-5">
              <Button
                variant="text"
                className="flex items-center gap-2"
                onClick={() =>
                  setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
                }
                disabled={currentPage === 1}
              >
                <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from(
                  { length: Math.ceil(courses.length / itemsPerPage) },
                  (_, index) => (
                    <IconButton
                      key={index}
                      variant={currentPage === index + 1 ? "filled" : "text"}
                      color="gray"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </IconButton>
                  )
                )}
              </div>
              <Button
                variant="text"
                className="flex items-center gap-2"
                onClick={() =>
                  setCurrentPage((prevPage) =>
                    Math.min(
                      prevPage + 1,
                      Math.ceil(courses.length / itemsPerPage)
                    )
                  )
                }
                disabled={
                  currentPage === Math.ceil(courses.length / itemsPerPage)
                }
              >
                Next <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Courses;
