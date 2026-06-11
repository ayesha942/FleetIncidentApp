export const sampleIncidents = [
  {
    id: 'INC-001',
    driverName: 'Ahmed Raza',
    vehicleId: 'TRK-14',
    type: 'Accident',
    submittedAt: '2025-06-10T08:23:00',
    status: 'triaged',
    rawReport: 'While making a delivery on Main Boulevard, a car ran a red light and hit my front bumper. Minor damage to the bumper and headlight. No injuries. Police report filed. Photos taken.',
    aiAnalysis: {
      severity: 'high',
      severityScore: 78,
      rootCause: 'Third-party fault',
      suggestedAction: 'File insurance claim. Schedule vehicle inspection before next route. Review dashcam footage.',
      tags: ['collision', 'third-party', 'police-report', 'insurance-needed'],
      summary: 'Collision caused by another driver running a red light. Vehicle has front-end damage. No injuries reported. Documentation appears complete.'
    }
  },
  {
    id: 'INC-002',
    driverName: 'Sara Malik',
    vehicleId: 'VAN-07',
    type: 'Delivery Delay',
    submittedAt: '2025-06-10T10:45:00',
    status: 'triaged',
    rawReport: 'Stuck in traffic on GT Road for 2 hours due to road construction. 4 deliveries delayed by 3 hours. Customers were notified but two were very upset and refused delivery.',
    aiAnalysis: {
      severity: 'medium',
      severityScore: 45,
      rootCause: 'Route planning — known construction not avoided',
      suggestedAction: 'Update route planning system with construction zones. Issue apology vouchers to affected customers. Review GT Road routes for next week.',
      tags: ['delay', 'route-issue', 'customer-complaint', 'route-update-needed'],
      summary: 'Traffic delays due to road construction caused 4 late deliveries and 2 customer refusals. Root issue is route planning not accounting for known construction.'
    }
  },
  {
    id: 'INC-003',
    driverName: 'Ahmed Raza',
    vehicleId: 'TRK-14',
    type: 'Vehicle Damage',
    submittedAt: '2025-06-09T14:10:00',
    status: 'triaged',
    rawReport: 'Back door hinge is loose again. Struggled to close it properly during deliveries. This is the 3rd time this month.',
    aiAnalysis: {
      severity: 'medium',
      severityScore: 52,
      rootCause: 'Recurring mechanical issue — unresolved repair',
      suggestedAction: 'Immediately schedule TRK-14 for workshop. Investigate why previous repairs did not hold. Consider temporary vehicle swap.',
      tags: ['mechanical', 'recurring', 'maintenance-failure', 'vehicle-swap-needed'],
      summary: 'Third occurrence of same door hinge issue on TRK-14 this month. Indicates previous repair was insufficient. Vehicle reliability at risk.'
    }
  },
  {
    id: 'INC-004',
    driverName: 'Usman Khan',
    vehicleId: 'TRK-22',
    type: 'Customer Complaint',
    submittedAt: '2025-06-10T09:00:00',
    status: 'triaged',
    rawReport: 'Customer at DHA Phase 5 complained that I was rude when they asked me to wait 10 minutes. I told them I had a schedule. They called the office.',
    aiAnalysis: {
      severity: 'medium',
      severityScore: 50,
      rootCause: 'Customer service — driver conduct',
      suggestedAction: 'Brief Usman on customer handling protocols. Follow up directly with the customer with an apology. Log against driver profile.',
      tags: ['conduct', 'customer-complaint', 'training-needed'],
      summary: 'Customer reported rude interaction with driver over a wait time dispute. Driver prioritized schedule over customer experience. Needs conduct coaching.'
    }
  },
  {
    id: 'INC-005',
    driverName: 'Bilal Hassan',
    vehicleId: 'VAN-03',
    type: 'Accident',
    submittedAt: '2025-06-09T16:30:00',
    status: 'triaged',
    rawReport: 'Reversed into a parked motorcycle in a narrow alley. The bike fell over. Owner was present and very angry. Small scratch on van bumper. Bike has some damage. We settled on the spot, I paid PKR 5000.',
    aiAnalysis: {
      severity: 'critical',
      severityScore: 88,
      rootCause: 'Driver error — reversing in restricted space',
      suggestedAction: 'Escalate to management immediately. Verify on-spot settlement was authorized. File formal incident report with insurance. Review driver history.',
      tags: ['collision', 'driver-fault', 'unauthorized-payment', 'escalate', 'insurance'],
      summary: 'Driver reversed into a parked motorcycle causing property damage. Driver made an unauthorized cash payment of PKR 5,000. This requires immediate management review and insurance filing.'
    }
  },
  {
    id: 'INC-006',
    driverName: 'Sara Malik',
    vehicleId: 'VAN-07',
    type: 'Vehicle Damage',
    submittedAt: '2025-06-08T11:20:00',
    status: 'triaged',
    rawReport: 'AC stopped working mid-route. It was very hot today. Completed the route but some temperature-sensitive packages may have been affected.',
    aiAnalysis: {
      severity: 'high',
      severityScore: 72,
      rootCause: 'Equipment failure — AC unit',
      suggestedAction: 'Inspect temperature-sensitive packages immediately. Schedule AC repair for VAN-07 before next use. Notify affected customers proactively.',
      tags: ['equipment-failure', 'cargo-risk', 'maintenance', 'customer-notification'],
      summary: 'AC failure during delivery of potentially temperature-sensitive cargo. VAN-07 needs immediate repair. Cargo integrity should be verified before customer delivery.'
    }
  },
  {
    id: 'INC-007',
    driverName: 'Kamran Ali',
    vehicleId: 'TRK-09',
    type: 'Delivery Delay',
    submittedAt: '2025-06-10T07:55:00',
    status: 'new',
    rawReport: 'Could not find the address. Google Maps kept giving wrong directions. Spent 45 minutes looking. Eventually a local helped me find it. Delivered 1 hour late.',
    aiAnalysis: null
  },
  {
    id: 'INC-008',
    driverName: 'Ahmed Raza',
    vehicleId: 'TRK-14',
    type: 'Customer Complaint',
    submittedAt: '2025-06-07T13:00:00',
    status: 'triaged',
    rawReport: 'Customer says packages were delivered to wrong door. Neighbor apparently received 2 of their packages.',
    aiAnalysis: {
      severity: 'low',
      severityScore: 28,
      rootCause: 'Driver error — wrong unit delivery',
      suggestedAction: 'Recover packages from neighbor. Re-deliver to correct customer. Note Ahmed Razas 3rd incident this month — consider performance review.',
      tags: ['wrong-delivery', 'driver-error', 'recovery-needed'],
      summary: 'Packages delivered to wrong address. Third incident for Ahmed Raza this month across different issue types — a pattern review is warranted.'
    }
  }
];

export const driverStats = [
  { name: 'Ahmed Raza', incidents: 3, vehicle: 'TRK-14', critical: 0, high: 1, medium: 1, low: 1 },
  { name: 'Sara Malik', incidents: 2, vehicle: 'VAN-07', critical: 0, high: 2, medium: 0, low: 0 },
  { name: 'Bilal Hassan', incidents: 1, vehicle: 'VAN-03', critical: 1, high: 0, medium: 0, low: 0 },
  { name: 'Usman Khan', incidents: 1, vehicle: 'TRK-22', critical: 0, high: 0, medium: 1, low: 0 },
  { name: 'Kamran Ali', incidents: 1, vehicle: 'TRK-09', critical: 0, high: 0, medium: 0, low: 0 },
];

export const vehicleStats = [
  { id: 'TRK-14', incidents: 3, types: ['Accident', 'Vehicle Damage', 'Customer Complaint'] },
  { id: 'VAN-07', incidents: 2, types: ['Delivery Delay', 'Vehicle Damage'] },
  { id: 'VAN-03', incidents: 1, types: ['Accident'] },
  { id: 'TRK-22', incidents: 1, types: ['Customer Complaint'] },
  { id: 'TRK-09', incidents: 1, types: ['Delivery Delay'] },
];

export const incidentTypes = [
  { type: 'Accident', count: 2, fill: '#EF4444' },
  { type: 'Delivery Delay', count: 2, fill: '#EAB308' },
  { type: 'Vehicle Damage', count: 2, fill: '#F97316' },
  { type: 'Customer Complaint', count: 2, fill: '#6B7280' },
];
