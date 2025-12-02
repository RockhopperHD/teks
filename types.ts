export interface Rubric {
  score_4_proficient: string;
  score_3_developing: string;
  score_2_beginning: string;
  score_1_not_yet: string;
  score_0_no_participation: string;
}

export interface Activity {
  title: string;
  timeframe: string;
  student_will_statement: string;
  assignment_description: string;
  evaluation_criteria: Rubric;
  activity_standards: string[];
}

export interface LessonPlan {
  title: string;
  description: string;
  subject: string;
  overarching_goals_standards: string[];
  activities: Activity[];
  notes?: string;
}

export interface StandardDefinition {
  id: string;
  description: string;
  category?: string;
}