
import React from "react";
import { Link } from "react-router-dom";
import { Service } from "../data/services";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <Link to={`/service/${service.id}`} className="w-full">
      <div 
        className="service-card"
        style={{ borderLeft: `4px solid ${service.color}` }}
      >
        <div className="text-3xl mb-2">{service.icon}</div>
        <h3 className="text-sm font-medium">{service.name}</h3>
      </div>
    </Link>
  );
};

export default ServiceCard;
