import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BiLock } from "react-icons/bi";
import { getSingleCourse, courseEnroll } from "../../api/studentApi";
import { Avatar, Button } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
// import { userActions } from "../../redux/userSlice";
import { useQuery } from "@tanstack/react-query";
import SingleCourseSkelton from "../common/utils/SingleCourseSkelton";
("../../components/common/utils/SingleCourseSkelton");

const SingleCourseView = () => {
  const user = useSelector((store) => store.user.user);
  const navigate = useNavigate();
  const [enrolled, setEnrolled] = useState(false);
  // const dispatch = useDispatch();
  const location = useLocation();

  const {
    data: course = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["SingleCourse", location.state.courseId],
    queryFn: () => getSingleCourse(location.state.courseId),
  });

  useEffect(() => {
    if (user && course && user.courses) {
      const isEnrolled = user.courses.some((item) => item.id === course.id);
      setEnrolled(isEnrolled);
    }
  }, [user, course]);

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
    } else {
      try {
        const response = await courseEnroll(course.id, user._id);
        if (response) {
          
          window.location.href = response;
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const goToCourse = () => {
    navigate("/learning", { state: { courseId: course?.id } });
  };

  if (isLoading) {
    return (
      <div className="">
        <SingleCourseSkelton />
      </div>
    );
  }
  return (
    <div className="min-h-screen max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16">
      {course && (
        <div className="container mx-auto p-8 animate-fade animate-ease-in-out">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Video Player */}
            <div className="lg:w-full">
              {course?.image ? (
                <img
                  src={course.image}
                  alt=""
                  className="min-h-full min-w-full object-cover"
                />
              ) : (
                <img
                  src='/images/dummy_img.jpg'
                  alt=""
                  className="h-72 min-w-full object-cover"
                />
              )}
            </div>

            {/* Course Details */}
            <div className="lg:w-full">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                {course?.name}
              </h2>
              <p className="text-lg text-gray-600 mb-6">{course?.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 mb-8">
                {/* Level */}
                <div>
                  <p className="text-gray-700 font-semibold">
                    <i className="fas fa-signal mr-2 text-green-700"></i>
                    {course?.level?.level}
                  </p>
                </div>

                {/* language */}
                <div>
                  <p className="text-gray-700 font-semibold flex">
                    <i className="fas fa-solid fa-language text-green-700 mr-2"></i>
                    {course?.language?.language}
                  </p>
                </div>

                {/* Price */}
                <div>
                  <p className="text-gray-700 font-semibold">
                    <i className="fas fa-rupee-sign mr-2 text-green-700"></i>₹{" "}
                    {course?.price}
                  </p>
                </div>

                {/* Instructor */}
                <div>
                  <p className="text-gray-700 font-semibold flex">
                    <i className="fas fa-chalkboard-teacher text-green-700 mr-2"></i>
                    {course?.instructor?.firstname}{" "}
                    {course?.instructor?.lastname}
                  </p>
                </div>

                {enrolled ? (
                  <Button
                    onClick={goToCourse}
                    color="green"
                    variant="gradient"
                    size="md"
                  >
                    Continue to Course
                  </Button>
                ) : (
                  <Button
                    variant="gradient"
                    size="md"
                    onClick={handleEnroll}
                    className={`${course.modules.length > 0 ? "" : "hidden"}`}
                  >
                    Enroll now
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Module Listing */}
          <div className="mt-8">
            {course?.modules?.length > 0 && (
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                Lessons:
              </h3>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {course?.modules?.map((module) => (
                <div
                  key={module.id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all ease-in-out duration-300"
                >
                  <div className="flex items-center mb-2">
                    {enrolled ? (
                      ""
                    ) : (
                      <span className="mr-2">
                        <BiLock size={20} color="green" />
                      </span>
                    )}

                    <h3 className="text-md font-semibold text-gray-800">
                      {module.module.name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600">{`Duration: ${module.module.duration}`}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Meet your Instructor
            </h2>
            <div className="flex items-center gap-3">
              <Avatar
                src="https://docs.material-tailwind.com/img/face-2.jpg"
                alt="avatar"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {course?.instructor?.firstname} {course?.instructor?.lastname}
                </h3>
                <p className="text-gray-700 mt-1">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                    {course?.instructor?.email}
                  </span>
                </p>
              </div>
            </div>
            <p className="text-gray-700 mt-4">
              Mob:{course?.instructor?.mobile}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleCourseView;
