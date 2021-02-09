import { Request, Response } from 'express';
import { CompanyDB } from '../models/documents/Company';

const strategicTrialPlan = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await CompanyDB.aggregate(
        [
          {$project: {
            _id: 0,
            company: 1,
            month: {$month: {$toDate: {$multiply: ["$billing.trialEnd", 1000]}}},
            year: {$year: {$toDate: {$multiply: ["$billing.trialEnd", 1000]}}}
          }},
          {$match: {
          "month":new Date().getMonth() +1,
          "year": new Date().getFullYear()
          }
        }
        ]
     )
     res.send(data)
    } catch (error) {
      console.error('Error in strategicTrialPlan controller', error);
    }
};

  
export default strategicTrialPlan;