import React from "react";
import { useNavigate } from "react-router-dom";
import { BiCategory } from "react-icons/bi";

const SingleCourse = ({ course }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[240px] bg-white border border-gray-200 rounded-sm shadow animate-fade animate-ease-in-out">
      <div className="flex justify-center">
        <img
          className="rounded-t-sm h-44  object-cover"
          src={course.image ? course.image : "/images/dummy_img.jpg"}
          // src='/images/sample.jpg'
          alt="product image"
        />
      </div>
      <div className="px-4 pb-4">
        <div>
          <h5 className="text-lg font-bold tracking-tight text-gray-900 h-16">
            {course.name}
          </h5>
          <div>
            <p className="truncate text-xs italic flex">
              <BiCategory color="green" className="mr-1" />
              {typeof course.category === "object"
                ? course.category.category
                : course.category}
            </p>
          </div>
        </div>
        <div>
          {course?.approval === "approved" && (
            <h6 className="text-sm font-bold text-green-600">Approved</h6>
          )}
          {course?.approval === "rejected" && (
            <h6 className="text-sm font-bold text-red-600">Rejected</h6>
          )}
          {course?.approval === "pending" && (
            <h6 className="text-sm font-bold text-blue-600">Pending</h6>
          )}
        </div>
        <div className="flex justify-between items-end pt-2">
          <span className="text-md font-bold text-gray-900">
            ₹{course?.price}
          </span>
          <button
            onClick={() => {
              navigate("/instructor/course-overview", {
                state: { courseId: course.id },
              });
            }}
            className="inline-flex items-center justify-center rounded-md bg-green-600 py-1 px-2 font-dm text-base font-small text-white shadow-xl shadow-green-400/75 transition-transform duration-200 ease-in-out hover:scale-[1.02]"
          >
            View course
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleCourse;
