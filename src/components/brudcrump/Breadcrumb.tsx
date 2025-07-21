import React from "react";
import { useNavigate } from "react-router";

interface BreadcrumbElement {
  page: string;
  path: string;
}

interface BreadcrumbProps {
  elements: BreadcrumbElement[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ elements }) => {
    const navigate = useNavigate();
    return (
        <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                {elements?.map((obj: BreadcrumbElement, idx: number) => (
                    <React.Fragment key={obj?.page + idx}>
                        <li>
                            <span onClick={() => navigate(obj?.path)} className="hover:underline cursor-pointer">{obj?.page}</span>
                        </li>
                        {idx < elements.length - 1 && (
                            <li>
                                <span className="mx-2">→</span>
                            </li>
                        )}
                    </React.Fragment>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
