"use client";

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Activity, BarChart3, ShieldAlert, CheckCircle2, AlertTriangle, 
  BrainCircuit, Database, Calculator, ArrowRight, Zap, RefreshCw, Sparkles,
  CalendarDays, Lightbulb, Target, Wrench, FileText, X
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// --- MOCK DATA DICTIONARY ---
const TF_DATA = {
  'ปัจจุบัน': {
    label: 'ปัจจุบัน (เรียลไทม์ - พฤษภาคม 2569)',
    kpi: { accuracy: 96.8, saved: 185.2, prevented: 32, growth: "+26.8%" },
    brainModules: [
      {
        title: "LME Copper & Metal Price Forecasting",
        version: "v3.5",
        status: "Fine-tuned (Active)",
        trainedOn: "ประวัติ LME Copper 10 ปี + FX USD/THB",
        purpose: "วิเคราะห์ราคากลาง คาดการณ์และล็อกราคาสัญญาซื้อขายโลหะระยะยาว",
        accuracy: "96.8%",
        icon: "trend"
      },
      {
        title: "Trade War Sentiment Analyzer",
        version: "v2.2",
        status: "Fine-tuned (Active)",
        trainedOn: "ภาษีนำเข้าโซลาร์, นโยบายกีดกันทางการค้า",
        purpose: "เตือนภัยสงครามการค้าล่วงหน้าเพื่อสลับใช้ผู้ผลิตในประเทศ",
        accuracy: "95.2%",
        icon: "brain"
      },
      {
        title: "Storm & Disaster Geo-Risk Engine",
        version: "v1.0",
        status: "Deployed (Active)",
        trainedOn: "พิกัดพายุถล่ม, ปริมาณน้ำฝนย้อนหลัง 5 ปี",
        purpose: "วิเคราะห์ภัยพิบัติระดับท้องถิ่นล่วงหน้า 3 วัน เพื่อสำรองหม้อแปลงไฟฟ้า",
        accuracy: "98.0%",
        icon: "shield"
      },
      {
        title: "Dynamic ROP & Lead-Time Model",
        version: "v2.5",
        status: "Active",
        trainedOn: "1.5 ล้านรายการ SAP ERP + vendor delivery",
        purpose: "ปรับระดับจุดสั่งซื้อและจำนวนจัดซื้ออัตโนมัติแบบเรียลไทม์",
        accuracy: "94.5%",
        icon: "database"
      },
      {
        title: "TCO & Holding Cost Optimizer",
        version: "v1.0",
        status: "Fine-tuned (Active)",
        trainedOn: "ข้อมูลสต็อก + ราคากลาง + กำลังผลิต Vendor 5 ปี",
        purpose: "เปรียบเทียบ TCO ซื้อทีเดียว vs ทยอยซื้อ แนะนำจำนวน Lot และรอบที่เหมาะสมที่สุด",
        accuracy: "97.5%",
        icon: "trend"
      }
    ],
    costData: [
      { month: 'Dec 25', human: 165, ai: 145, lme: 142 },
      { month: 'Jan 26', human: 172, ai: 150, lme: 145 },
      { month: 'Feb 26', human: 175, ai: 152, lme: 148 },
      { month: 'Mar 26', human: 180, ai: 155, lme: 150 },
      { month: 'Apr 26', human: 170, ai: 148, lme: 142 },
      { month: 'May 26', human: 168, ai: 144, lme: 138 },
    ],
    learningData: [
      { epoch: 'Pre-train', accuracy: 94.0, loss: 6.0 },
      { epoch: 'Fine-tune', accuracy: 95.8, loss: 4.2 },
      { epoch: 'RLHF (Feedback)', accuracy: 96.8, loss: 3.2 },
    ],
    crises: [
      {
        title: "พายุฤดูร้อนถล่มพื้นที่ภาคเหนือ (กำลังติดตามสถานการณ์)",
        date: "พฤษภาคม 2569 • หม้อแปลงไฟฟ้า & เสาไฟฟ้า",
        status: "success",
        saved: "฿15.5M",
        human: "อาจเกิดเสาไฟฟ้าล้มและหม้อแปลงระเบิดวงกว้าง รอซ่อมแซมตามรอบปกติ 14 วัน ทำให้ไฟฟ้าดับนาน",
        ai: "AI เปิด Alert ระดับสูง ประสานคลังภูมิภาคสำรองหม้อแปลง 800 เครื่อง และย้ายทีมช่างล่วงหน้า 48 ชั่วโมง",
        details: {
          earlySignal: "ระบบ Geo-Risk คาดการณ์พายุฤดูร้อนระดับรุนแรง (ความเร็วลม > 90 กม./ชม.) จากการรวมตัวของมวลอากาศเย็นในประเทศจีนล่วงหน้า 3 วัน",
          strategy: "Emergency Supply & Crew Pre-positioning",
          lots: "ย้ายหม้อแปลงสำรองฉุกเฉิน 800 เครื่องจากคลังกลางอยุธยาไปยังคลังภูมิภาค (เชียงใหม่, พิษณุโลก)",
          price: "ใช้บริการขนส่งด่วนพิเศษอัตราพิเศษของ PEA ประหยัดกว่าการเช่าขนส่งเอกชนเฉลี่ย 15%",
          impact: "รักษาความมั่นคงในระบบจ่ายไฟ 99.8% สามารถกู้คืนระบบจำหน่ายหลังพายุสงบภายใน 6 ชั่วโมง (ลดลงจากเดิม 80%)"
        }
      },
      {
        title: "TCO Optimization: หม้อแปลง 160 kVA ทยอยซื้อ 4 รอบ",
        date: "พฤษภาคม 2569 • หม้อแปลง 160 kVA 3 เฟส (SAP 10067)",
        status: "success",
        saved: "฿28.4M",
        human: "ซื้อทีเดียว 2,454 เครื่อง Holding Cost พุ่ง 47.3M/ปี Vendor ผลิตไม่ทัน ไม่มีที่เก็บสินค้า เกิด Unfulfilled 1,755 เครื่อง",
        ai: "AI วิเคราะห์ TCO และแนะนำทยอยซื้อ 4 รอบ รอบละ 614 เครื่อง × 3 Lot ลด Holding Cost เหลือ 18.9M/ปี ประหยัด 28.4M/ปี ไม่มี Unfulfilled",
        details: {
          earlySignal: "ระบบตรวจพบว่าสต็อกเหลือ 12 เครื่อง (ใช้ได้แค่ 1 วัน) แต่ Lead Time 84 วัน ช่องว่าง 83 วัน + กำลังผลิตรวม 699 เครื่อง/เดือน ไม่พอสำหรับซื้อทีเดียว 2,454 เครื่อง",
          strategy: "Quarterly Procurement + TCO Optimization",
          lots: "ทยอยซื้อ 4 รอบ (พ.ค.69, ส.ค.69, พ.ย.69, ก.พ.70) รอบละ 3 Lot (อัตรา 40%/30%/30%) รวม 12 Lot",
          price: "ใช้สัญญากรอบราคา (Frame Agreement) ล็อคราคา ฿150,000/เครื่อง ทั้งปี ทยอยเรียกของรายไตรมาส",
          impact: "Holding Cost ลดจาก 47.3M เหลือ 18.9M (ประหยัด 28.4M/ปี) Vendor ผลิตได้ทัน ไม่มี Unfulfilled กำลังผลิตต่อไตรมาส 2,097 > ความต้องการ 614"
        }
      }
    ],
    improvements: {
      solved: [
        "การพยากรณ์ราคานำเข้าและอัตราแลกเปลี่ยนแบบ Real-time",
        "การตรวจจับภัยพิบัติระดับท้องถิ่น (Local Geo-Risk Warning)",
        "TCO & Holding Cost Optimization แนะนำทยอยซื้อ 4 รอบ ลดต้นทุนรวม 28.4M/ปี"
      ],
      issues: [
        "ข้อจำกัดความจุคลังย่อยระดับอำเภอในการรองรับพัสดุฉุกเฉินล็อตใหญ่"
      ],
      action: "เพิ่มโมเดล Virtual Warehouse Sharing และปรับ Holding Cost Rate ตามประเภทพัสดุ"
    },
    trainingData: [
      "ข้อมูลอุตุนิยมวิทยาแบบ Real-time จากกรมอุตุนิยมวิทยา",
      "ประวัติและกำลังจัดเตรียมอุปกรณ์ของคลังภูมิภาคทั้งหมด",
      "โมเดลวิเคราะห์ความเสียหายจากภัยธรรมชาติย้อนหลัง 5 ปี (Storm Damage Model)",
      "เคส TCO หม้อแปลง 160 kVA: ซื้อทีเดียว vs ทยอยซื้อ 4 รอบ ประหยัด Holding Cost 28.4M/ปี",
      "ข้อมูลกำลังผลิต Vendor 5 ราย (Effective Capacity) สำหรับการจับคู่ Lot รายไตรมาส"
    ]
  },
  '6M': {
    label: '6 เดือนที่ผ่านมา (Jul - Dec 2025)',
    kpi: { accuracy: 85.0, saved: 12.5, prevented: 2, growth: "+5.2%" },
    brainModules: [
      {
        title: "LME Copper & Metal Forecasting",
        version: "v3.0",
        status: "Active",
        trainedOn: "ข้อมูลราคาโลหะย้อนหลัง 6 เดือน",
        purpose: "วิเคราะห์ทิศทางราคากลางระยะสั้น",
        accuracy: "85.0%",
        icon: "trend"
      },
      {
        title: "FX Volatility Monitor",
        version: "v1.0",
        status: "Active",
        trainedOn: "ดัชนีอัตราแลกเปลี่ยนย้อนหลัง 6 เดือน",
        purpose: "วิเคราะห์ความผันผวนค่าเงินบาทระยะสั้น",
        accuracy: "82.5%",
        icon: "database"
      }
    ],
    costData: [
      { month: 'Jul 25', human: 160, ai: 155, lme: 152 },
      { month: 'Aug 25', human: 165, ai: 150, lme: 148 },
      { month: 'Sep 25', human: 158, ai: 152, lme: 150 },
      { month: 'Oct 25', human: 170, ai: 155, lme: 152 },
      { month: 'Nov 25', human: 168, ai: 148, lme: 145 },
      { month: 'Dec 25', human: 165, ai: 145, lme: 142 },
    ],
    learningData: [
      { epoch: 'Initial', accuracy: 80, loss: 20 },
      { epoch: 'Mid', accuracy: 82.5, loss: 17.5 },
      { epoch: 'Final', accuracy: 85.0, loss: 15 },
    ],
    crises: [
      {
        title: "ค่าเงินบาทผันผวนกะทันหัน",
        date: "Q3 2025 • สายไฟฟ้านำเข้า",
        status: "partial",
        saved: "฿4.5M",
        human: "ต้นทุนนำเข้าพุ่ง 15% และหยุดชะงัก",
        ai: "ระบบแจ้งเตือนช้าไป 3 วัน แต่สามารถสลับไปสั่งซื้อจาก Supplier ในประเทศ (Local Sourcing) ได้ทันเวลาบางส่วน",
        details: {
          earlySignal: "ตรวจพบแนวโน้ม Fund Flow ไหลออกและประกาศอัตราดอกเบี้ย FED ที่เกินคาดการณ์ (Macro API)",
          limitation: "ข้อจำกัดด้านระเบียบจัดซื้อ: การย้ายออเดอร์กลับประเทศกะทันหันต้องผ่านกระบวนการอนุมัติฉุกเฉินซึ่งใช้เวลา ทำให้ยังมีของค้างส่งบางส่วน",
          strategy: "Local Sourcing Pivot (Partial)",
          lots: "ย้ายออเดอร์นำเข้า 40% กลับมาซื้อในประเทศ",
          price: "ซื้อได้ที่ ฿2,500 (เทียบกับนำเข้าที่แพงขึ้นเป็น ฿2,800)",
          impact: "เซฟงบได้ 4.5 ล้าน แต่ยังมีของค้างส่งบางส่วน"
        }
      }
    ],
    improvements: {
      solved: ["การจัดการ Over-stock ตามรอบไตรมาส", "ลดเวลาประเมิน Lead time"],
      issues: ["การตอบสนองต่อข่าวมหภาค (Macro-economic News) ล่าช้า"],
      action: "เพิ่ม Real-time FX & News API ให้ Risk Agent วิเคราะห์ความผันผวนรายวัน"
    },
    trainingData: [
      "ระเบียบการจัดซื้อพัสดุ PEA ล่าสุด (พ.ศ. 2568)",
      "ข้อมูลราคากลางย้อนหลัง 6 เดือน",
      "สถิติการเบิกจ่ายคลังส่วนกลาง (อยุธยา)"
    ]
  },
  '1Y': {
    label: '1 ปี (Jan - Dec 2025)',
    kpi: { accuracy: 89.5, saved: 48.2, prevented: 5, growth: "+12.5%" },
    brainModules: [
      {
        title: "LME Copper & Metal Forecasting",
        version: "v3.0",
        status: "Active",
        trainedOn: "ประวัติ LME Copper 1 ปี + ดัชนีความเชื่อมั่น",
        purpose: "วิเคราะห์ราคากลางและล็อกสัญญารายไตรมาส",
        accuracy: "89.5%",
        icon: "trend"
      },
      {
        title: "Geo-Risk Area Warning",
        version: "v1.0",
        status: "Active",
        trainedOn: "ข้อมูลสภาพภูมิอากาศ El Nino + Geo-data",
        purpose: "ประเมินความเสี่ยงน้ำท่วมและภัยแล้งล่วงหน้า 14 วัน",
        accuracy: "86.0%",
        icon: "shield"
      }
    ],
    costData: [
      { month: 'Feb 25', human: 155, ai: 145, lme: 140 },
      { month: 'Apr 25', human: 165, ai: 150, lme: 148 },
      { month: 'Jun 25', human: 160, ai: 152, lme: 150 },
      { month: 'Aug 25', human: 170, ai: 155, lme: 152 },
      { month: 'Oct 25', human: 168, ai: 148, lme: 145 },
      { month: 'Dec 25', human: 165, ai: 145, lme: 142 },
    ],
    learningData: [
      { epoch: 'Q1', accuracy: 82, loss: 18 },
      { epoch: 'Q2', accuracy: 85, loss: 15 },
      { epoch: 'Q3', accuracy: 87.5, loss: 12.5 },
      { epoch: 'Q4', accuracy: 89.5, loss: 10.5 },
    ],
    crises: [
      {
        title: "วิกฤตน้ำท่วมโรงงานภาคเหนือ",
        date: "Q3 2025 • หม้อแปลงไฟฟ้า",
        status: "success",
        saved: "฿22M",
        human: "ยึดติด Supplier รายเดียว ทำให้ของขาดสต็อกนาน 45 วัน",
        ai: "AI ตรวจจับความเสี่ยงเชิงพื้นที่ (Geo-risk) บังคับใช้กลยุทธ์กระจายคำสั่งซื้อล่วงหน้าไปยังภาคตะวันออก",
        details: {
          earlySignal: "ระบบ Geo-Risk สแกนเจอพายุไต้ฝุ่นก่อตัวและปริมาณน้ำฝนสะสมเหนือเขื่อนเกินพิกัดล่วงหน้า 14 วัน",
          strategy: "Geo-Diversification (ย้ายฐานผลิต)",
          lots: "กระจายออเดอร์ 2 Lots ไปยังโรงงานชลบุรีและระยอง",
          price: "ล็อกราคาเดิมที่ ฿120,000/เครื่อง ไม่โดนชาร์จค่าเร่งด่วน",
          impact: "ได้ของตรงเวลา 100% แม้โรงงานหลักภาคเหนือจมน้ำ"
        }
      }
    ],
    improvements: {
      solved: ["การกระจายความเสี่ยง (Multi-sourcing)", "เรียนรู้รอบฤดูกาล (Seasonal Trend)"],
      issues: ["การทำนายราคาโลหะช่วงวิกฤตความขัดแย้งภูมิรัฐศาสตร์"],
      action: "Fine-tune โมเดลด้วยข้อมูลสงครามการค้า และราคาทองแดงย้อนหลัง 10 ปี"
    },
    trainingData: [
      "ข้อมูลสภาพอากาศ (El Nino) กระทบโลจิสติกส์",
      "ดัชนีราคาทองแดงตลาด LME ย้อนหลัง 1 ปี",
      "ข้อมูล Vendor ทิ้งงานย้อนหลัง 1 ปี"
    ]
  },
  '3Y': {
    label: '3 ปี (2023 - 2025)',
    kpi: { accuracy: 94.2, saved: 124.5, prevented: 14, growth: "+21.0%" },
    brainModules: [
      {
        title: "LME Copper & Metal Forecasting",
        version: "v2.0",
        status: "Active",
        trainedOn: "ราคากลางจัดซื้อและราคาตลาดโลก 3 ปี",
        purpose: "วางแผนล็อกราคาและจัดทำ Long-term Contract",
        accuracy: "94.2%",
        icon: "trend"
      },
      {
        title: "Dynamic ROP Calculator",
        version: "v1.5",
        status: "Active",
        trainedOn: "ปริมาณเบิกจ่ายย้อนหลัง 3 ปี ในระบบ ERP",
        purpose: "คำนวณปรับรอบสั่งซื้อ ROP อัตโนมัติในสภาวะชิปขาดแคลน",
        accuracy: "91.0%",
        icon: "database"
      }
    ],
    costData: [
      { month: 'Jan 23', human: 152, ai: 148, lme: 145 },
      { month: 'Jul 23', human: 165, ai: 155, lme: 152 },
      { month: 'Jan 24', human: 168, ai: 152, lme: 149 },
      { month: 'Jul 24', human: 155, ai: 140, lme: 138 },
      { month: 'Jan 25', human: 170, ai: 155, lme: 150 },
      { month: 'Dec 25', human: 165, ai: 145, lme: 142 },
    ],
    learningData: [
      { epoch: '2023', accuracy: 85, loss: 15 },
      { epoch: '2024', accuracy: 90, loss: 10 },
      { epoch: '2025', accuracy: 94.2, loss: 5.8 },
    ],
    crises: [
      {
        title: "วิกฤตชิปขาดแคลนทั่วโลก (Global Chip Shortage)",
        date: "Q2 2023 • Smart Meter",
        status: "success",
        saved: "฿45M",
        human: "รอจนสต็อกเหลือ 20% ถึงสั่ง ทำให้ของขาดช่วง 2 เดือนเพราะ Lead Time พุ่งเป็น 12 สัปดาห์",
        ai: "AI คำนวณ Dynamic ROP ใหม่และสั่งซื้อล่วงหน้า 60 วัน",
        details: {
          earlySignal: "เห็นสัญญาณ Lead Time การส่งมอบแผงวงจรในอุตสาหกรรมยานยนต์ทั่วโลกเริ่มชะงัก (Cross-industry Anomaly)",
          strategy: "Dynamic ROP + Advance Ordering",
          lots: "สั่งรวดเดียว 3 Lots ล่วงหน้า 6 เดือน",
          price: "ซื้อได้ที่ ฿1,500/ตัว (หลังจากนั้นราคาพุ่งทะลุ ฿2,200)",
          impact: "มีมิเตอร์ติดตั้งให้ประชาชนครบทุกบ้าน ไม่เกิด Backlog"
        }
      },
      {
        title: "สงครามการค้ากระทบราคาแผงโซลาร์",
        date: "Q1 2024 • Solar Panels",
        status: "success",
        saved: "฿32M",
        human: "ชะลอการสั่งซื้อหวังราคาลง แต่ราคาพุ่งขึ้น 30% แบบไม่คาดคิด",
        ai: "AI แนะนำให้ทำ Long-term Contract (ล็อกราคา) ตั้งแต่ก่อนเกิดเหตุการณ์",
        details: {
          earlySignal: "NLP โมเดลสแกนเจอการตั้งกำแพงภาษีล่วงหน้าจากเอกสาร US Commerce Department",
          strategy: "Long-term Price Hedging",
          lots: "ทำสัญญายาว 2 ปี ทยอยส่งมอบทีละไตรมาส",
          price: "ล็อกราคา ฿4,500/แผง (ตลาดกระโดดไป ฿6,000+)",
          impact: "ประหยัดงบลงทุนขยาย Grid พลังงานสะอาดได้ 32 ล้าน"
        }
      }
    ],
    improvements: {
      solved: ["ทำนาย LME Index ในระดับปี", "การปรับ Dynamic ROP อัตโนมัติ"],
      issues: ["การเชื่อมต่อข้อมูลกับคลังย่อยระดับอำเภอ"],
      action: "ขยายสเกลการประมวลผลให้ครอบคลุมคลังภูมิภาค (Regional Data Integration)"
    },
    trainingData: [
      "สถิติประวัติการจัดซื้อและปริมาณสต็อก 3 ปี (2023-2025)",
      "ข้อมูลวิกฤตชิปขาดแคลน (Global Chip Shortage 2022-2023)",
      "การเปลี่ยนแปลงข้อบังคับและนโยบายจัดซื้อของ PEA ตลอด 3 ปี"
    ]
  },
  '5Y': {
    label: '5 ปี (2021 - 2025)',
    kpi: { accuracy: 96.5, saved: 215.8, prevented: 28, growth: "+31.5%" },
    brainModules: [
      {
        title: "Safety Stock Optimization",
        version: "v1.0",
        status: "Active",
        trainedOn: "ประวัติการส่งมอบและขนส่งติดขัดช่วงโควิด 5 ปี",
        purpose: "คำนวณและสำรองพัสดุฉุกเฉิน (Safety Stock) เพื่อลดปัญหาห่วงโซ่หยุดชะงัก",
        accuracy: "96.5%",
        icon: "shield"
      },
      {
        title: "Logistics Freeze Analyzer",
        version: "v1.0",
        status: "Active",
        trainedOn: "ดัชนีค่าระวางเรือตู้สินค้าโลก (Freight rates)",
        purpose: "วิเคราะห์ผลกระทบโลจิสติกส์ระงับตัวข้ามทวีป",
        accuracy: "92.8%",
        icon: "database"
      }
    ],
    costData: [
      { month: '2021', human: 140, ai: 135, lme: 132 },
      { month: '2022', human: 158, ai: 145, lme: 140 },
      { month: '2023', human: 165, ai: 150, lme: 148 },
      { month: '2024', human: 172, ai: 155, lme: 150 },
      { month: '2025', human: 168, ai: 148, lme: 145 },
    ],
    learningData: [
      { epoch: '2021', accuracy: 65, loss: 35 },
      { epoch: '2022', accuracy: 78, loss: 22 },
      { epoch: '2023', accuracy: 88, loss: 12 },
      { epoch: '2024', accuracy: 94, loss: 6 },
      { epoch: '2025', accuracy: 96.5, loss: 3.5 },
    ],
    crises: [
      {
        title: "วิกฤตซ้อนทับ: COVID-19 + Logistics Freeze",
        date: "2021 - 2022 • สายไฟ/หม้อแปลง",
        status: "success",
        saved: "฿85M",
        human: "พึ่งพาระบบ Just-In-Time มากเกินไป เกิดภาวะช็อก Supply Chain ขาดตอน",
        ai: "คำนวณ Buffers สำรองไว้ล่วงหน้า (Safety Stock Optimization) ประคองสต็อกจนพ้นวิกฤต",
        details: {
          earlySignal: "จับสัญญาณดัชนีระวางเรือ (Freight Rate) พุ่งทะยานจากจีน + ข่าวล็อกดาวน์รุนแรงในยุโรป",
          strategy: "Safety Stock Optimization + Forward Buying",
          lots: "สั่งล่วงหน้า 1 Lot ใหญ่ (เหมาเข่ง) เพื่อล็อกราคาก่อนวิกฤต",
          price: "ราคาล็อก ฿250,000/เครื่อง (ต่อมาราคาตลาดพุ่งไป ฿310,000)",
          impact: "มีอุปกรณ์ใช้ต่อเนื่อง 8 เดือนเต็มโดยต้นทุนไม่เพิ่มขึ้น"
        }
      },
      {
        title: "ราคาเหล็กและทองแดงพุ่งทะยาน (Post-COVID Reopening)",
        date: "Q3 2022 • อุปกรณ์ฮาร์ดแวร์",
        status: "success",
        saved: "฿42M",
        human: "ต้นทุนพุ่งกระฉูดกว่า 40% จำเป็นต้องชะลอการสั่งซื้อจนของเกือบขาดสต็อก",
        ai: "ประเมินแนวโน้มตลาดและล็อกราคาล่วงหน้าด้วย Long-term Contract ตั้งแต่ Q1",
        details: {
          earlySignal: "โมเดลพบความต้องการโลหะพื้นฐานฟื้นตัวทั่วโลกพร้อมกัน V-Shape Recovery",
          strategy: "Long-term Hedging Contract",
          lots: "ทำสัญญา 12 เดือน ทยอยส่งมอบ 4 Lots (Lot ละ 25%)",
          price: "ตรึงราคา LME Copper ที่ $7,500/MT (ราคาจุดพีคขึ้นไปถึง $10,500/MT)",
          impact: "ประหยัดต้นทุนส่วนเพิ่ม ฿42 ล้าน และลดปัญหาผู้รับเหมาทิ้งงาน"
        }
      },
      {
        title: "วิกฤตชิปขาดแคลนทั่วโลก (Global Chip Shortage)",
        date: "2023 • Smart Meter & อิเล็กทรอนิกส์",
        status: "success",
        saved: "฿45M",
        human: "รอจนสต็อกเหลือ 20% ถึงสั่ง ทำให้ของขาดช่วงเพราะ Lead Time พุ่งเป็น 12 สัปดาห์",
        ai: "AI คำนวณ Dynamic ROP ใหม่และกระจายออเดอร์ (Multi-sourcing) ทั่วเอเชีย",
        details: {
          earlySignal: "สัญญาณ Lead Time โรงงานผลิตแผ่นเวเฟอร์ (Wafer) ในไต้หวันเริ่มดีเลย์",
          strategy: "Dynamic ROP + Multi-sourcing",
          lots: "ซอยสัญญา 3 Lots: จีน (40%), ไต้หวัน (30%), Local (30%)",
          price: "จีน ฿1,200/ตัว, ไต้หวัน ฿1,250/ตัว, Local ฿1,350/ตัว",
          impact: "แก้ปัญหา Lead time ยืดเยื้อ ได้รับของทยอยตามแผน 100%"
        }
      },
      {
        title: "สงครามการค้า + วิกฤตน้ำท่วมโรงงานในประเทศ",
        date: "2024 • แผงโซลาร์และหม้อแปลง",
        status: "partial",
        saved: "฿32M",
        human: "สั่งซื้อฉุกเฉินได้ของแพงและไม่ครบ ทำให้โครงการขยายกริดล่าช้า",
        ai: "ผสมผสานแผนซอยสัญญา (Lot Strategy) กับระบบ e-Bidding แบบ Multi-awarding เพื่อกระจายความเสี่ยง",
        details: {
          earlySignal: "สแกนข่าวพายุ + สัญญาณนโยบายแบนสินค้านำเข้าจากอเมริกา",
          limitation: "ข้อจำกัดทางกายภาพ (Force Majeure): แม้ AI จะกระจายออเดอร์หนีความเสี่ยงแล้ว แต่พายุพัดเข้าตรงจุดตั้งโรงงานระยองพอดี (น้ำท่วมจริง) ทำให้กำลังผลิตส่วนนั้นเสียหาย 100% แต่ระบบไฟยังรอดเพราะพยุงด้วยของจากโคราช",
          strategy: "Lot Strategy (Risk Split)",
          lots: "แบ่งจัดซื้อ 2 Lots: โรงงานระยอง 70%, โรงงานโคราช 30%",
          price: "เฉลี่ย ฿350,000/ชุด (สูงกว่าปกติ 5% แต่การันตีได้ของ)",
          impact: "โรงงานระยองถูกน้ำท่วม แต่ยังได้ของจากโคราชมาพยุงระบบ (รอด 30%)"
        }
      },
      {
        title: "ค่าเงินบาทผันผวนรุนแรง (FX Volatility Shock)",
        date: "2025 • อุปกรณ์นำเข้า",
        status: "success",
        saved: "฿11.8M",
        human: "ต้นทุนนำเข้าสูงขึ้นแบบเฉียบพลัน ต้องงัดงบฉุกเฉินมาใช้",
        ai: "สลับใบสั่งซื้อไปใช้ Local Supplier ภายในประเทศแบบอัตโนมัติ (Local Sourcing Pivot)",
        details: {
          earlySignal: "ความผันผวนของกราฟค่าเงินบาทเทียบดอลลาร์เข้าเขต Overbought กะทันหัน",
          strategy: "Local Sourcing Pivot",
          lots: "ย้ายออเดอร์ 100% สู่ 3 Local Suppliers (Lot ละ 33%)",
          price: "Local ฿5,200/ชิ้น (ถูกกว่านำเข้าที่โดน FX หวดไป ฿5,800)",
          impact: "หลบเลี่ยงความเสี่ยงอัตราแลกเปลี่ยนได้ 100% ประหยัด 11.8 ล้านบาท"
        }
      }
    ],
    improvements: {
      solved: ["ระบบเรียนรู้สมบูรณ์ระดับ Full Cycle", "ครอบคลุมภัยคุกคามทุกรูปแบบ (Pandemic, Geo-politics, Weather)"],
      issues: ["ขีดจำกัดด้านกฎหมายที่ยังล็อกให้ต้องทำกระบวนการนาน"],
      action: "เสนอแก้ระเบียบ (Policy Proposal) โดยใช้ข้อมูลจาก AI ไปอ้างอิงกับกรมบัญชีกลาง"
    },
    trainingData: [
      "ข้อมูลมหาวิกฤตซ้อนทับ: โควิด-19 + Supply Chain Freeze",
      "ดัชนีราคาทองแดงตลาดโลกและค่าเงินบาท (USD/THB) 10 ปี",
      "ข้อมูลผลกระทบสงครามการค้า (US-China Trade War)",
      "SAP ERP Data ของ PEA จำนวน 1.5 ล้านรายการ"
    ]
  },
  '7Y': {
    label: '7 ปี (2019 - 2025)',
    kpi: { accuracy: 97.2, saved: 345.5, prevented: 45, growth: "+42.8%" },
    brainModules: [
      {
        title: "Trade War Sentiment Analyzer",
        version: "v1.0",
        status: "Active (Early stage)",
        trainedOn: "นโยบายภาษีนำเข้าสหรัฐ-จีน ย้อนหลัง 7 ปี",
        purpose: "ตรวจจับและประเมินผลกระทบการตั้งกำแพงภาษีล่วงหน้า",
        accuracy: "88.0%",
        icon: "brain"
      },
      {
        title: "Decade Price Cycle Predictor",
        version: "v1.0",
        status: "Active",
        trainedOn: "ข้อมูลวัฏจักรราคาโลหะทองแดงย้อนหลัง 7 ปี",
        purpose: "ตรวจจับรอบราคาขึ้นลงระยะยาว",
        accuracy: "85.5%",
        icon: "trend"
      }
    ],
    costData: [
      { month: '2019', human: 135, ai: 130, lme: 128 },
      { month: '2020', human: 130, ai: 125, lme: 120 },
      { month: '2021', human: 140, ai: 135, lme: 132 },
      { month: '2022', human: 158, ai: 145, lme: 140 },
      { month: '2023', human: 165, ai: 150, lme: 148 },
      { month: '2024', human: 172, ai: 155, lme: 150 },
      { month: '2025', human: 168, ai: 148, lme: 145 },
    ],
    learningData: [
      { epoch: '2019', accuracy: 55, loss: 45 },
      { epoch: '2021', accuracy: 75, loss: 25 },
      { epoch: '2023', accuracy: 88, loss: 12 },
      { epoch: '2025', accuracy: 97.2, loss: 2.8 },
    ],
    crises: [
      {
        title: "วิกฤตความขัดแย้งทางการค้าสหรัฐ-จีน (Early Trade War)",
        date: "2019 • อุปกรณ์นำเข้า",
        status: "partial",
        saved: "฿12M",
        human: "นโยบายภาษีนำเข้าทำให้ต้นทุนพุ่ง 25% ไม่ได้เตรียมตัวล่วงหน้า",
        ai: "เริ่มเก็บข้อมูลโครงสร้างราคา Supply Chain รูปแบบใหม่ และวิเคราะห์ความเสี่ยงด้านภาษี",
        details: {
          earlySignal: "พบเอกสารร่างการขึ้นกำแพงภาษีนำเข้าโซลาร์เซลล์และเหล็กกล้าแบบกะทันหัน",
          limitation: "ข้อจำกัดของ Data (Unprecedented Event): โมเดลในปี 2019 ยังเป็นช่วงเริ่มต้น ไม่มีประวัติศาสตร์สงครามการค้ายุคใหม่ให้เรียนรู้ จึงขยับตัวได้แค่ 50% ของความเสียหายทั้งหมด",
          strategy: "Tax Impact Analysis",
          lots: "ย้ายการจัดซื้อ 50% ไปยัง Supplier ประเทศที่สาม",
          price: "หลบเลี่ยงภาษีได้กว่า ฿12 ล้าน",
          impact: "เริ่มพัฒนาระบบ AI ให้รู้จักโครงสร้างภาษี"
        }
      },
      {
        title: "โควิดระลอกแรก (First Wave COVID-19)",
        date: "2020 • การจัดซื้อชะงักทั่วประเทศ",
        status: "success",
        saved: "฿55M",
        human: "หยุดการสั่งซื้อทั้งหมดแบบกะทันหัน ทำให้พัสดุบางประเภทขาดเมื่อต้องกลับมาซ่อมบำรุง",
        ai: "สั่งซื้อชิ้นส่วนบำรุงรักษา (Maintenance parts) กักตุนล่วงหน้าในช่วงที่ราคาตลาดโลกลงแรง",
        details: {
          earlySignal: "ดัชนี LME ร่วงหนักจากการเทขาย (Panic Sell) ทั่วโลก",
          strategy: "Counter-cyclical Purchasing",
          lots: "จัดซื้อฉุกเฉิน 2 Lots ใหญ่ตอนราคาทองแดงลงสุด",
          price: "ซื้อได้ถูกกว่าค่าเฉลี่ยปี 2019 ถึง 15%",
          impact: "ต้นทุนลดลงมหาศาล และมีของพร้อมซ่อมกริดทั่วประเทศ"
        }
      }
    ],
    improvements: {
      solved: ["สามารถเข้าใจความสัมพันธ์ของภูมิรัฐศาสตร์ (Geo-politics)", "ทนทานต่อ Economic Shock ขนาดยักษ์"],
      issues: ["การบูรณาการข้อมูลภาษีแบบข้ามพรมแดน"],
      action: "เสนอ Policy ระดับประเทศเพื่อรองรับ Trade War ระยะยาว"
    },
    trainingData: [
      "ข้อมูลประวัติการจัดซื้อยาว 7 ปี",
      "สถิติความขัดแย้งทางการค้าระดับโลก",
      "ข้อมูลวิกฤตโรคระบาด (Pandemic Impact Analysis)"
    ]
  },
  '10Y': {
    label: '10 ปี (2016 - 2025)',
    kpi: { accuracy: 98.8, saved: 650.0, prevented: 72, growth: "+68.5%" },
    brainModules: [
      {
        title: "Data Digitization Engine",
        version: "v1.0",
        status: "Completed",
        trainedOn: "เอกสารสถิติกระดาษ / แฟ้มจัดซื้อจัดจ้าง 10 ปี",
        purpose: "แปลงข้อมูลเอกสารเก่าเป็นดิจิทัลเพื่อใช้สร้างระบบปัญญาประดิษฐ์",
        accuracy: "99.2%",
        icon: "database"
      }
    ],
    costData: [
      { month: '2016', human: 120, ai: 115, lme: 110 },
      { month: '2018', human: 125, ai: 120, lme: 118 },
      { month: '2020', human: 130, ai: 125, lme: 120 },
      { month: '2022', human: 158, ai: 145, lme: 140 },
      { month: '2024', human: 172, ai: 155, lme: 150 },
      { month: '2025', human: 168, ai: 148, lme: 145 },
    ],
    learningData: [
      { epoch: '2016', accuracy: 40, loss: 60 },
      { epoch: '2018', accuracy: 60, loss: 40 },
      { epoch: '2020', accuracy: 75, loss: 25 },
      { epoch: '2022', accuracy: 85, loss: 15 },
      { epoch: '2024', accuracy: 95, loss: 5 },
      { epoch: '2025', accuracy: 98.8, loss: 1.2 },
    ],
    crises: [
      {
        title: "ยุคก่อน AI / แฟ้มกระดาษ (Pre-Digital Era)",
        date: "2016-2018 • ระบบจัดซื้อเดิม",
        status: "partial",
        saved: "฿0M",
        human: "ใช้ระบบเอกสาร สถิติเก็บใน Excel วิเคราะห์แนวโน้มราคาล่วงหน้าไม่ได้",
        ai: "ช่วงสะสมข้อมูล (Data Collection & Labeling) ยังไม่เริ่มสั่งการจริง",
        details: {
          earlySignal: "N/A (อยู่ในช่วงรวบรวม Data)",
          limitation: "ยุคเริ่มต้น (Pre-Deployment): ระบบยังไม่สามารถตัดสินใจอัตโนมัติได้ ทำได้เพียงแปลงเอกสารกระดาษเป็น Data เท่านั้น",
          strategy: "Data Digitization",
          lots: "N/A",
          price: "N/A",
          impact: "แปลงข้อมูลกระดาษ 5 แสนแผ่นเป็น Structured Data เพื่อสร้าง PEA Brain"
        }
      },
      {
        title: "วิกฤตพลังงาน (Global Energy Crisis)",
        date: "2022 • สายไฟ/หม้อแปลง",
        status: "success",
        saved: "฿120M",
        human: "ราคาวัตถุดิบและค่าขนส่ง (Freight) พุ่งเป็นประวัติการณ์ งบประมาณบานปลาย",
        ai: "AI ใช้ข้อมูล 10 ปี สร้างแบบจำลอง Forecasting ตัดสินใจเหมา Lot ใหญ่ล่วงหน้า 1 ปี",
        details: {
          earlySignal: "จับสัญญาณราคาน้ำมันและก๊าซธรรมชาติในยุโรปที่พุ่งตัวพร้อมเพรียงกัน 3 เดือนติด",
          strategy: "Decade-based Predictive Modeling",
          lots: "จัดซื้อ Mega-Lot 5 พันล้านบาท ล็อกราคาล่วงหน้า 2 ปี",
          price: "ต่ำกว่าราคา Spot Market ถึง 22%",
          impact: "ประหยัดงบได้กว่า 120 ล้านบาทในดีลเดียว"
        }
      }
    ],
    improvements: {
      solved: ["เรียนรู้ Cycle ของเศรษฐกิจระดับทศวรรษ (Decade Cycle)", "เปลี่ยนถ่ายสู่ Digital Procurement 100%"],
      issues: ["- AI ทำงานได้เต็มประสิทธิภาพแล้ว -"],
      action: "Deploy โมเดลนี้ให้เป็นต้นแบบ National AI สำหรับหน่วยงานรัฐอื่นๆ"
    },
    trainingData: [
      "คลังข้อมูลดิจิทัลทั้งหมดของ PEA (10 ปี)",
      "ข้อมูลวัฏจักรเศรษฐกิจโลก (Macro-economic Cycles)",
      "รูปแบบนโยบายการเงินระดับโลกและดอกเบี้ย (Fed Rates History)"
    ]
  }
};

type TimeframeType = 'ปัจจุบัน' | '6M' | '1Y' | '3Y' | '5Y' | '7Y' | '10Y';

export default function BacktestSimulator() {
  const [activeTF, setActiveTF] = useState<TimeframeType>('ปัจจุบัน');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  // Trigger animation on load or TF change
  useEffect(() => {
    setIsRunning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return p + 10; // Faster progress for demo feel
      });
    }, 50);
    return () => clearInterval(interval);
  }, [activeTF]);

  const data = TF_DATA[activeTF];
  const formatCurrency = (val: number) => `฿${val}k`;

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Header Banner & Timeframe Selector */}
      <section className="rounded-[32px] bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 border border-slate-700/50 p-8 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-blue-200 shadow-inner mb-4">
              <Activity size={14} className="text-blue-300" />
              Multi-Timeframe Backtesting
            </div>
            <h1 className="text-[26px] font-black tracking-tight text-white drop-shadow-md leading-tight mb-2">
              เจาะลึกสถิติแบบย้อนหลัง (Time Machine) <br/>
            </h1>
            <p className="text-[14px] leading-relaxed text-slate-300 font-medium">
              วิเคราะห์ความแม่นยำ ปัญหา และการปรับแต่งโมเดล (Fine-tuning) ของ PEA Brain
            </p>
          </div>
          
          <div className="flex flex-col gap-4 w-full lg:w-auto">
            {/* TF Selector */}
            <div className="flex bg-slate-800/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md self-start lg:self-end overflow-x-auto max-w-full">
              {(['ปัจจุบัน', '6M', '1Y', '3Y', '5Y', '7Y', '10Y'] as TimeframeType[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setActiveTF(tf)}
                  className={`px-6 py-2 rounded-xl text-[13px] font-bold transition-all ${
                    activeTF === tf 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Status Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 w-full lg:w-72">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase">Status: {data.label}</span>
                {isRunning ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-full">
                    <RefreshCw size={10} className="animate-spin" /> RUNNING
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/20 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={10} /> DONE
                  </span>
                )}
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-fuchsia-500 transition-all duration-200 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Accuracy */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-50 rounded-bl-[100px] -z-10 transition-colors group-hover:bg-fuchsia-100" />
          <div className="w-12 h-12 rounded-2xl bg-fuchsia-100 flex items-center justify-center mb-4">
            <BrainCircuit size={24} className="text-fuchsia-600" />
          </div>
          <div className="text-[14px] font-bold text-slate-500 uppercase tracking-wider mb-1">ความแม่นยำระบบ (Accuracy)</div>
          <div className="text-[36px] font-black text-slate-800 flex items-baseline gap-2">
            {progress < 100 ? (progress * (data.kpi.accuracy/100)).toFixed(1) : data.kpi.accuracy.toFixed(1)}
            <span className="text-[18px] text-fuchsia-500">%</span>
          </div>
          <div className="text-[14px] font-medium text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp size={14} /> {data.kpi.growth} จาก Base Model
          </div>
        </div>

        {/* Card 2: Cost Saved */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -z-10 transition-colors group-hover:bg-emerald-100" />
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
            <Calculator size={24} className="text-emerald-600" />
          </div>
          <div className="text-[14px] font-bold text-slate-500 uppercase tracking-wider mb-1">งบที่ประหยัดได้ (Cost Saved)</div>
          <div className="text-[36px] font-black text-slate-800 flex items-baseline gap-2">
            <span className="text-[20px] text-slate-400">฿</span>
            {progress < 100 ? (progress * (data.kpi.saved/100)).toFixed(1) : data.kpi.saved.toFixed(1)}
            <span className="text-[18px] text-emerald-500">M</span>
          </div>
          <div className="text-[14px] font-medium text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp size={14} /> เทียบกับการจัดซื้อปกติ
          </div>
        </div>

        {/* Card 3: Crisis Prevented */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-[100px] -z-10 transition-colors group-hover:bg-amber-100" />
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
            <ShieldAlert size={24} className="text-amber-600" />
          </div>
          <div className="text-[14px] font-bold text-slate-500 uppercase tracking-wider mb-1">ป้องกันวิกฤตของขาด (Prevented)</div>
          <div className="text-[36px] font-black text-slate-800 flex items-baseline gap-2">
            {progress < 100 ? Math.floor(progress * (data.kpi.prevented/100)) : data.kpi.prevented}
            <span className="text-[18px] text-amber-500">ครั้ง</span>
          </div>
          <div className="text-[14px] font-medium text-amber-600 mt-2 flex items-center gap-1">
            <AlertTriangle size={14} /> อิงจากประวัติปัญหาในระบบ
          </div>
        </div>
      </div>

      {/* Upgraded AI Brain Cards Section */}
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <BrainCircuit size={18} />
          </div>
          <div>
            <h2 className="text-[18px] font-black text-slate-800">
              สถานะโมดูลสมอง AI ที่ได้รับการอัปเกรด (Fine-tuned AI Brain Modules)
            </h2>
            <p className="text-[13px] text-slate-500">โมเดลปัญญาประดิษฐ์ระดับย่อยที่ผ่านการปรับแต่งชุดข้อมูลจัดซื้อและปัจจัยมหภาคในแต่ละรอบ</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {(data.brainModules || []).map((module: any, i: number) => {
            const IconComponent = 
              module.icon === 'trend' ? TrendingUp :
              module.icon === 'shield' ? ShieldAlert :
              module.icon === 'database' ? Database :
              module.icon === 'brain' ? BrainCircuit : BrainCircuit;

            return (
              <div 
                key={i} 
                className="bg-slate-50 hover:bg-white rounded-2xl p-4 border border-slate-100 hover:border-purple-200 hover:shadow-md transition-all duration-300 relative overflow-hidden group"
              >
                {/* Background glow on hover */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-start justify-between mb-3 relative z-10">
                  <div className={`p-2 rounded-xl shrink-0 ${
                    module.icon === 'trend' ? 'bg-emerald-50 text-emerald-600' :
                    module.icon === 'shield' ? 'bg-amber-50 text-amber-600' :
                    module.icon === 'database' ? 'bg-blue-50 text-blue-600' :
                    'bg-purple-50 text-purple-600'
                  }`}>
                    <IconComponent size={18} />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[12px] font-extrabold text-slate-400 uppercase">{module.version}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-full mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {module.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 relative z-10">
                  <div>
                    <h4 className="text-[14px] font-black text-slate-800 group-hover:text-purple-700 transition-colors">
                      {module.title}
                    </h4>
                    {module.accuracy && (
                      <p className="text-[13px] text-fuchsia-600 font-bold mt-0.5">
                        Accuracy: {module.accuracy}
                      </p>
                    )}
                  </div>
                  <div className="border-t border-slate-100 pt-2 text-[13px] text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-700">เทรนจาก:</span> {module.trainedOn}
                  </div>
                  <div className="text-[13px] text-slate-500 leading-relaxed">
                    <span className="font-semibold text-slate-700">ภารกิจ:</span> {module.purpose}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Analysis & Improvements (NEW BLOCK) */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
                <Target className="text-blue-500" size={20} />
                Analysis & Improvements
              </h2>
              <p className="text-[12px] text-slate-500 mt-1">วิเคราะห์ผลลัพธ์และแนวทางการปรับปรุงระบบ (Feedback Loop)</p>
            </div>
            {['5Y', '7Y', '10Y'].includes(activeTF) && (
              <button 
                onClick={() => setShowPolicyModal(true)}
                className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-sm"
              >
                <FileText size={14} />
                <span className="hidden sm:inline">Generate Policy Proposal</span>
                <span className="sm:hidden">Proposal</span>
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-4">
            {/* Training Data */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Database size={16} className="text-slate-600" />
                <h4 className="text-[13px] font-bold text-slate-800">ชุดข้อมูลที่ใช้เทรนโมเดล (Training Datasets)</h4>
              </div>
              <ul className="space-y-1">
                {data.trainingData.map((item, i) => (
                  <li key={i} className="text-[12px] text-slate-600 flex items-start gap-1.5">
                    <span className="text-blue-500 font-bold mt-0.5">›</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Solved */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <h4 className="text-[13px] font-bold text-emerald-800">ปัญหาที่แก้ไขได้สำเร็จ (What went well)</h4>
              </div>
              <ul className="space-y-1">
                {data.improvements.solved.map((item, i) => (
                  <li key={i} className="text-[12px] text-emerald-700 flex items-start gap-1.5">
                    <span className="text-emerald-500 mt-0.5">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Issues */}
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-rose-600" />
                <h4 className="text-[13px] font-bold text-rose-800">จุดอ่อนที่พบในรอบนี้ (Areas for Improvement)</h4>
              </div>
              <ul className="space-y-1">
                {data.improvements.issues.map((item, i) => (
                  <li key={i} className="text-[12px] text-rose-700 flex items-start gap-1.5">
                    <span className="text-rose-500 mt-0.5">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mt-auto">
              <div className="flex items-center gap-2 mb-2">
                <Wrench size={16} className="text-indigo-600" />
                <h4 className="text-[13px] font-bold text-indigo-800">แนวทางปรับปรุงโมเดล (Fine-tuning Action)</h4>
              </div>
              <p className="text-[12px] text-indigo-700 leading-relaxed font-medium">
                {data.improvements.action}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Container */}
        <div className="flex flex-col gap-6">
          {/* Chart: Cost */}
          <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-6">
            <h2 className="text-[14px] font-bold text-slate-900 flex items-center gap-2 mb-4">
              <BarChart3 className="text-emerald-500" size={16} /> เปรียบเทียบต้นทุน: การตัดสินใจมนุษย์ vs AI (Cost Optimization)
            </h2>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.costData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={formatCurrency} domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                    formatter={(value: any, name: any) => [
                      `฿${value}k`, 
                      name === 'human' ? 'ต้นทุนซื้อจริง (Human)' : name === 'ai' ? 'ต้นทุนจำลอง (AI)' : 'LME Index'
                    ]}
                  />
                  <Area type="monotone" dataKey="ai" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAi)" />
                  <Line type="monotone" dataKey="human" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: '#94a3b8' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart: Learning */}
          <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-6">
            <h2 className="text-[14px] font-bold text-slate-900 flex items-center gap-2 mb-4">
              <BrainCircuit className="text-fuchsia-500" size={16} /> พัฒนาการความแม่นยำของโมเดล (Accuracy & Loss)
            </h2>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.learningData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="epoch" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[50, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="accuracy" name="ความแม่นยำ (%)" stroke="#d946ef" strokeWidth={3} dot={{ r: 4, fill: '#d946ef' }} />
                  <Line type="monotone" dataKey="loss" name="อัตราผิดพลาด (%)" stroke="#f43f5e" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Section 3: Crisis Prevention Log */}
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[18px] font-bold text-slate-900 flex items-center gap-2 mb-1">
              <ShieldAlert className="text-amber-500" size={20} />
              Crisis Prevention Log (บันทึกวิกฤตในช่วงเวลาที่เลือก)
            </h2>
            <p className="text-[12px] text-slate-500">เจาะลึกสถานการณ์จริง (Human) เทียบกับการรับมือในโมเดล (AI Simulation)</p>
          </div>
          <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl px-4 py-3 text-[11px] text-amber-800 max-w-lg flex items-start gap-2 shadow-sm">
            <Sparkles size={14} className="text-amber-600 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <span className="font-bold">หมายเหตุการพรีเซนต์:</span> แสดงเฉพาะ <span className="font-bold underline decoration-amber-500/50">Highlight Cases</span> (วิกฤตระดับรุนแรงสูงสุด / Black Swan) จากทั้งหมด <span className="font-bold text-amber-900 bg-amber-200/50 px-1 rounded">{data.kpi.prevented} เหตุการณ์</span> ที่ระบบปัญญาประดิษฐ์ตรวจพบและป้องกันได้สำเร็จ (เหตุการณ์ที่เหลือเป็นการรับมือกับความผิดปกติรายวัน เช่น ชิปเมนต์เลท 1-2 วัน หรือการสลับ Supplier ย่อย ซึ่ง AI จัดการเบื้องหลังโดยอัตโนมัติ)
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {data.crises.map((crisis, idx) => (
            <div key={idx} className="rounded-xl border border-slate-100 p-5 bg-slate-50 hover:bg-white hover:shadow-md transition-all group">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${crisis.status === 'success' ? 'bg-amber-100' : 'bg-rose-100'}`}>
                    <AlertTriangle size={18} className={crisis.status === 'success' ? 'text-amber-600' : 'text-rose-600'} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-slate-800">{crisis.title}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">{crisis.date}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                  crisis.status === 'success' 
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                  : 'bg-amber-100 text-amber-700 border-amber-200'
                }`}>
                  {crisis.status === 'success' ? 'ป้องกันสำเร็จ' : 'ป้องกันได้บางส่วน'} (Saved {crisis.saved})
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">เหตุการณ์จริง (Human)</div>
                  <p className="text-[12px] text-slate-700 font-medium">{crisis.human}</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-1 bg-indigo-500 h-full" />
                  <div className="text-[10px] font-bold text-indigo-400 uppercase mb-1 flex items-center gap-1"><Sparkles size={10}/> สิ่งที่ AI ทำในแบบจำลอง (AI Simulation)</div>
                  <p className="text-[12px] text-indigo-900 font-medium">{crisis.ai}</p>
                </div>
              </div>
              
              {/* Detailed Breakdown if available */}
              {crisis.details && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-1">
                    <Target size={12} className="text-slate-500" />
                    AI Action Details (เจาะลึกกลยุทธ์ของ AI)
                  </div>
                  
                  {(crisis.details as any).earlySignal && (
                    <div className="bg-amber-50 rounded-lg p-3 mb-3 border border-amber-100 flex gap-2 items-start">
                      <Zap size={14} className="text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-bold text-amber-800 uppercase mb-0.5">Early Warning Signal (สัญญาณเตือนล่วงหน้าที่ AI ตรวจพบ)</div>
                        <div className="text-[11px] text-amber-700 font-medium">{(crisis.details as any).earlySignal}</div>
                      </div>
                    </div>
                  )}

                  {(crisis.details as any).limitation && (
                    <div className="bg-rose-50 rounded-lg p-3 mb-3 border border-rose-100 flex gap-2 items-start">
                      <ShieldAlert size={14} className="text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-bold text-rose-800 uppercase mb-0.5">System Limitation (ทำไมถึงป้องกันได้แค่บางส่วน?)</div>
                        <div className="text-[11px] text-rose-700 font-medium">{(crisis.details as any).limitation}</div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-slate-100 rounded-lg p-2.5">
                      <div className="text-[10px] text-slate-500 font-bold mb-1">กลยุทธ์ (Strategy)</div>
                      <div className="text-[11px] text-slate-700 font-semibold">{(crisis.details as any).strategy}</div>
                    </div>
                    <div className="bg-slate-100 rounded-lg p-2.5">
                      <div className="text-[10px] text-slate-500 font-bold mb-1">การซอยสัญญา (Lot Mgmt)</div>
                      <div className="text-[11px] text-slate-700 font-semibold">{(crisis.details as any).lots}</div>
                    </div>
                    <div className="bg-slate-100 rounded-lg p-2.5">
                      <div className="text-[10px] text-slate-500 font-bold mb-1">ราคาเฉลี่ยที่ได้ (Price)</div>
                      <div className="text-[11px] text-slate-700 font-semibold">{(crisis.details as any).price}</div>
                    </div>
                  </div>
                  <div className="mt-3 bg-emerald-50 rounded-lg p-3 flex gap-2 items-start">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-emerald-800">ผลลัพธ์สุทธิ (Net Impact)</div>
                      <div className="text-[11px] text-emerald-700">{(crisis.details as any).impact}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Policy Proposal Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-white/20">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <FileText className="text-indigo-600" size={20} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-slate-800">AI-Generated Policy Proposal</h3>
                  <p className="text-[12px] text-slate-500">ร่างหนังสือบันทึกข้อความถึงกรมบัญชีกลาง</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPolicyModal(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-8 overflow-y-auto bg-[#fafafa]">
              <div className="bg-white p-10 border border-slate-200 shadow-sm rounded-xl max-w-3xl mx-auto min-h-[500px] font-serif relative">
                {/* Garuda Mock */}
                <div className="w-16 h-16 mx-auto mb-6 bg-slate-200 rounded-full flex items-center justify-center opacity-30">
                  <span className="text-[10px] font-sans">ครุฑ</span>
                </div>
                
                <h1 className="text-center text-[18px] font-bold mb-8">บันทึกข้อความ</h1>
                
                <div className="flex justify-between mb-2">
                  <p className="text-[14px]"><strong>ส่วนราชการ</strong> การไฟฟ้าส่วนภูมิภาค (ฝ่ายบริหารห่วงโซ่อุปทาน)</p>
                </div>
                <div className="flex justify-between mb-6">
                  <p className="text-[14px]"><strong>ที่</strong> มท ๕๓๐๐.๐/พิเศษ</p>
                  <p className="text-[14px]"><strong>วันที่</strong> ๒๔ พฤษภาคม ๒๕๖๙</p>
                </div>
                <div className="mb-8">
                  <p className="text-[14px]"><strong>เรื่อง</strong> ขอเสนอทบทวนแนวทางการจัดซื้อแบบ "แยกสัญญา (Lot Strategy)" ในสภาวะวิกฤตซัพพลายเชน</p>
                </div>
                
                <div className="space-y-4 text-[14px] leading-relaxed text-justify">
                  <p><strong>เรียน</strong> อธิบดีกรมบัญชีกลาง</p>
                  <p>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ด้วยการไฟฟ้าส่วนภูมิภาค (PEA) ได้นำระบบปัญญาประดิษฐ์ (PEA Brain AI) มาใช้ในการวิเคราะห์ข้อมูลการจัดซื้อจัดจ้าง 
                    และได้ทำการจำลองผลย้อนหลัง (Backtesting) เป็นระยะเวลา ๕ ปี (พ.ศ. ๒๕๖๔ - ๒๕๖๘) พบว่าในสภาวะวิกฤตเศรษฐกิจระดับโลก เช่น การขาดแคลนชิปประมวลผล 
                    และปัญหาความขัดแย้งทางภูมิรัฐศาสตร์ การยึดหลักการทำสัญญาแบบรายเดียว (Single Award) ตามระเบียบปกติ ก่อให้เกิดความเสี่ยงต่อการขาดแคลนพัสดุสำคัญ 
                    (Critical Materials) ซึ่งส่งผลกระทบต่อความมั่นคงทางพลังงาน
                  </p>
                  <p>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;จากการประมวลผลของระบบ AI แบบจำลองชี้ให้เห็นว่า หากสามารถใช้กลยุทธ์การจัดซื้อแบบแยกสัญญา (Lot Strategy) หรือ Multi-Awarding 
                    ล่วงหน้าก่อนเกิดวิกฤต จะสามารถกระจายความเสี่ยงไปยังผู้ประกอบการหลายราย (Multi-sourcing) ซึ่งผลการจำลองพบว่า 
                    <span className="font-bold bg-yellow-100 px-1">สามารถป้องกันการขาดแคลนพัสดุได้ถึง ๒๘ ครั้ง และประหยัดงบประมาณความสูญเสียทางโอกาสได้รวมกว่า ๒๑๕.๘ ล้านบาท</span>
                  </p>
                  <p>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ดังนั้น การไฟฟ้าส่วนภูมิภาค จึงใคร่ขอเสนอให้กรมบัญชีกลางพิจารณาทบทวนระเบียบ และกำหนดเงื่อนไขพิเศษ (Special Clause) 
                    เพื่อให้อำนาจหน่วยงานรัฐสามารถใช้ดุลยพินิจประกอบกับผลการวิเคราะห์จาก AI (Data-Driven Evidence) ในการกำหนดการจัดซื้อแบบแยกสัญญาได้ 
                    เพื่อสร้างความยืดหยุ่น (Resilience) ให้กับระบบจัดซื้อของประเทศ
                  </p>
                  <p>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;จึงเรียนมาเพื่อโปรดพิจารณา
                  </p>
                </div>
                
                <div className="mt-16 text-center text-[14px]">
                  <p>( ลงชื่อ .................................................... )</p>
                  <p className="mt-2">(ร่างโดย PEA Brain AI Copilot)</p>
                </div>
                
                <div className="absolute top-8 right-8 border-2 border-red-500 text-red-500 font-sans font-bold text-[12px] px-3 py-1 rounded-md rotate-12 opacity-80">
                  DRAFTED BY AI
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-5 border-t border-slate-100 bg-white flex justify-end gap-3">
              <button 
                onClick={() => setShowPolicyModal(false)}
                className="px-5 py-2 rounded-xl text-[13px] font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                ปิด
              </button>
              <button 
                onClick={() => {
                  alert("ดาวน์โหลดไฟล์ PDF เรียบร้อยแล้ว (Demo)");
                  setShowPolicyModal(false);
                }}
                className="px-5 py-2 rounded-xl text-[13px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-colors flex items-center gap-2"
              >
                <FileText size={14} /> ดาวน์โหลด PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
