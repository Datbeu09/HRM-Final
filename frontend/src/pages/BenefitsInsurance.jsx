import React, { useEffect, useState } from "react";




import Pagination from "../components/common/Pagination";
import InsuranceFilter from "../components/BenefitsInsurance/InsuranceFilter";
import InsuranceTable from "../components/BenefitsInsurance/InsuranceTable";
import InsuranceInsight from "../components/BenefitsInsurance/InsuranceInsight";
import { getEmployees } from "../api/employees.api";


const PAGE_SIZE = 5;

export default function BenefitsInsurance() {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getEmployees().then((data) => {
      setEmployees(data);
      setFiltered(data);
    });
  }, []);

  // 👉 reset page khi filter
  useEffect(() => {
    setPage(1);
  }, [filtered]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const start = (page - 1) * PAGE_SIZE;
  const pageData = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div className="flex min-h-screen bg-background font-display">
      <main className="flex-1 bg-[#F8FAFB] overflow-y-auto">
        <div className="max-w-screen-2xl mx-auto p-6 space-y-6">

          <InsuranceFilter
            data={employees}
            onFilter={setFiltered}
            onReset={() => setFiltered(employees)}
          />

          <InsuranceTable data={pageData} />

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />

          <InsuranceInsight total={filtered.length} />

        </div>
      </main>
    </div>
  );
}
