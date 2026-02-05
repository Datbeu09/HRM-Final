import React, { useState, useEffect } from "react";
import { getEmployeesWithDepartments } from "../../api/employees.api";
import EmployeeTable from "../../components/Employees/EmployeeTable";

const Employees = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployeesWithDepartments();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  return <EmployeeTable employees={employees} />;
};

export default Employees;