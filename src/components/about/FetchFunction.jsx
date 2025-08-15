
const fetchCourses = async () => {
    try {
        const response = await fetch("https://onlinecourse-backend-okdb.onrender.com/courses/free?skip=0&limit=5")
        console.log("hey here is hte response"+ response)
    }
    catch (err) {
      console.error("Failed to fetch:", err);
    }
}

export default fetchCourses;