import React from 'react';
import { FiBookOpen, FiUsers, FiStar, FiCheckCircle } from 'react-icons/fi';
import { HiOutlineAcademicCap } from 'react-icons/hi';

const teachingInterests = [
  'Renewable Energy Systems',
  'Smart Grid & Microgrid Systems, Distributed Generation',
  'Power Electronics & Applications',
  'Electrical Machines and Motor Drives',
  'Electrical Circuit Analysis, Advanced Circuits',
  'Control System',
  'Power System Analysis',
  'Power System Dynamics, Control and Stability',
  'Transmission & Distribution System Design',
  'Electrical Power Design',
];

const currentSupervisions = [
  { student: 'Sandford Stebbings', topic: 'Cyber-Attack Resilient Nonlinear Controller Design for Interconnected Power Systems' },
  { student: 'Sana Fazal', topic: 'Control of Solar Photovoltaic Based Microgrids to Enhance Resiliency and Stability' },
  { student: 'Sahan Tharindu Dissanayake', topic: 'Instrumented Motion-Based Quantification of Movement Dysfunction Using Probabilistic Machine Learning' },
  { student: 'Khalil Gholami', topic: 'Robust Participation of Multi-Energy Virtual Power Plants in Energy and Ancillary Service Markets' },
  { student: 'Pathiraja Mudiyanselage Randeniya', topic: 'Objective Assessment and Clinical Insights in Friedreich Ataxia Using Machine Learning' },
  { student: 'Azfar Inteha', topic: 'Optimal DG Allocation and Coordinated Voltage Control in PV-rich Active Distribution Network' },
  { student: 'Kashfia Rahman Oyshei', topic: 'Uncertainty Aware Peer-to-Peer Energy Trading' },
  { student: 'Kisal Kawshika Gunawardan Hathamune Liyanage', topic: 'Control of Solar Photovoltaic Integrated Electric Vehicle Charging System for Grid Stability' },
  { student: 'Md Mhamud Hussen Sifat', topic: 'Digital Twin-Based Control Framework for Enhancing Microgrid Resilience and Stability' },
  { student: 'Ashika Savinda Mendis', topic: 'Dynamic Modelling and Control of Grid Forming Battery Storage for Stability Enhancement' },
  { student: 'Himalay Baidya', topic: 'Development of AI Based Control Framework for Hydrogen-Integrated Microgrids in Australia' },
];

const completedSupervisions = [
  { student: 'Sumaira Tasnim', topic: 'Investigation of Advanced Machine Learning Methods for Wind Power Prediction', year: 2021 },
  { student: 'Most Akter', topic: 'A Game Theoretic Model of Transactive Energy Management in Interconnected Residential Microgrid Cluster', year: 2021 },
  { student: 'Md Abdul Barik', topic: 'Protection of Resonant Grounded Power Distribution Systems for Mitigating Powerline Bushfire', year: 2020 },
  { student: 'Amir Taghvaie Gelehkolaee', topic: 'Design, Modelling and Control of Grid Connected Solar Photovoltaic System with Solid-state Transformer', year: 2022 },
  { student: 'Muhammad Waseem Altaf', topic: 'Protection of Microgrids with Renewable Energy Sources', year: 2023 },
  { student: 'Sharmin Rahman', topic: 'Voltage Stability Analysis of Power Grids and Real-time Assessment Using Synchrophasor Technology', year: 2024 },
  { student: 'Monowar Hossain', topic: 'Model Parameters and State of Charge Estimation of Li-Ion Battery for Energy Management in Solar PV-Battery Based Micro-Grid', year: 2023 },
  { student: 'Mohammad Kamruzzaman Khan Prince', topic: 'Design and Control of a Grid Connected Permanent Magnet Synchronous Generator-based Wind Energy Conversion System', year: 2023 },
  { student: 'Lahiru Laminda Abeysekara', topic: 'Quantitative Assessment of Neurological Dysfunction using Kinematic Measures', year: 2024 },
  { student: 'Devinder Kaur', topic: 'Bayesian Deep Learning for Energy Forecasting with Uncertainties', year: 2024 },
  { student: 'Lahiru Sandaruwan Aththanayake', topic: 'Dynamic Model Reduction of Power Systems Integrated with Inverter-based Resources for Stability Analysis', year: 2024 },
  { student: 'Cameron Smith', topic: 'Solid State Transformer and Model Predictive Control for Photovoltaic Systems', year: 2024 },
  { student: 'Maliduwa Liyana Arachchige Liyanarachchi', topic: 'Power System Strength Assessment With Inverter-Based Resources', year: 2025 },
  { student: 'Sithara Sewwandi Galwadu Acharige', topic: 'Control of Electric Vehicle Charging System With Grid Support Functionalities', year: 2025 },
];

export default function Courses() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-slate-800 text-white">
        <div className="section-container text-center">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Teaching & Supervision</p>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">Teaching & Research Supervision</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Award-winning educator with expertise spanning renewable energy, power systems, and electrical engineering.</p>
        </div>
      </section>

      {/* Teaching Interests */}
      <section className="section-container">
        <h2 className="section-title">Teaching Interests</h2>
        <p className="section-subtitle">Areas of teaching expertise at undergraduate and postgraduate levels.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {teachingInterests.map((item) => (
            <div key={item} className="flex items-center gap-3 p-3 rounded-lg bg-surface">
              <FiBookOpen className="text-accent flex-shrink-0" />
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Current Doctoral Supervision */}
      <section className="bg-surface">
        <div className="section-container">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center"><HiOutlineAcademicCap className="text-xl" /></div>
            <h2 className="section-title !mb-0">Current Doctoral Supervision</h2>
          </div>
          <p className="section-subtitle mt-2">Currently supervising {currentSupervisions.length} PhD students at the School of Engineering, Deakin University.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {currentSupervisions.map(({ student, topic }) => (
              <div key={student} className="card">
                <div className="flex items-start gap-3">
                  <FiUsers className="text-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-primary text-sm">{student}</p>
                    <p className="text-xs text-muted mt-1 leading-relaxed">{topic}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Completed Doctoral Supervision */}
      <section className="section-container">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center"><FiCheckCircle className="text-xl" /></div>
          <h2 className="section-title !mb-0">Completed Doctoral Supervision</h2>
        </div>
        <p className="section-subtitle mt-2">{completedSupervisions.length} PhD students successfully graduated.</p>
        <div className="grid md:grid-cols-2 gap-4">
          {completedSupervisions.map(({ student, topic, year }) => (
            <div key={student} className="card">
              <div className="flex items-start gap-3">
                <FiStar className="text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-primary text-sm">{student}</p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{year}</span>
                  </div>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{topic}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Supervision CTA */}
      <section className="bg-accent/5">
        <div className="section-container text-center">
          <div className="w-14 h-14 rounded-xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4"><HiOutlineAcademicCap className="text-2xl" /></div>
          <h2 className="section-title">Interested in Research Supervision?</h2>
          <p className="section-subtitle mx-auto">Available for Masters by Research and PhD supervision. If you're interested in pursuing a research degree in renewable energy, electric vehicles, power systems, or smart grids — get in touch.</p>
          <a href="/contact" className="btn-primary">Enquire About Supervision</a>
        </div>
      </section>
    </>
  );
}