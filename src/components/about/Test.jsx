import React, { useState, useEffect } from 'react';
import fetchCourses from './FetchFunction.jsx';



const Test = () => {

    const [courses, setCourses] = useState(0);

    return (
        <>
        <div className="vh-100">
            <h1>courses</h1>
            <a  
            type="button" 
            className="btn btn-sm rounded-5"
            onClick={fetchCourses}
            >set courses</a>
        </div>
        </>
    );
}

export default Test;