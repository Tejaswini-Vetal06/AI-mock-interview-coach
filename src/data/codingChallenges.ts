import { CodingChallenge } from '../types';

export const CODING_CHALLENGES: CodingChallenge[] = [
  {
    id: 'code-01',
    title: 'Calculate Binary Classification Metrics (Precision, Recall, F1)',
    language: 'python',
    difficulty: 'Easy',
    topic: 'Machine Learning',
    description: `Given two lists of binary integers \`y_true\` and \`y_pred\` (0 or 1), write a function \`classification_metrics(y_true, y_pred)\` that computes and returns a dictionary with:
- \`"precision"\`: float rounded to 4 decimals (or 0.0 if TP + FP == 0)
- \`"recall"\`: float rounded to 4 decimals (or 0.0 if TP + FN == 0)
- \`"f1"\`: float rounded to 4 decimals (or 0.0 if Precision + Recall == 0)

Do not import scikit-learn. Implement the calculations from first principles using standard Python.`,
    examples: [
      {
        input: 'y_true = [1, 0, 1, 1, 0, 1], y_pred = [1, 0, 0, 1, 0, 1]',
        output: '{"precision": 1.0, "recall": 0.75, "f1": 0.8571}',
        explanation: 'True Positives (TP) = 3, False Positives (FP) = 0, False Negatives (FN) = 1. Precision = 3/3 = 1.0, Recall = 3/4 = 0.75, F1 = 2*(1.0*0.75)/(1.0+0.75) = 0.8571'
      }
    ],
    starterCode: `def classification_metrics(y_true, y_pred):
    # Your code here
    # Return dict: {"precision": float, "recall": float, "f1": float}
    tp = 0
    fp = 0
    fn = 0
    tn = 0
    
    # Iterate and calculate TP, FP, FN, TN
    for yt, yp in zip(y_true, y_pred):
        if yt == 1 and yp == 1:
            tp += 1
        elif yt == 0 and yp == 1:
            fp += 1
        elif yt == 1 and yp == 0:
            fn += 1
        else:
            tn += 1
            
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
    
    return {
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1": round(f1, 4)
    }
`,
    solutionCode: `def classification_metrics(y_true, y_pred):
    tp = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 1)
    fp = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 1)
    fn = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 0)
    
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
    
    return {
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1": round(f1, 4)
    }
`,
    testCases: [
      {
        id: 'tc-01',
        description: 'Standard mixed predictions',
        input: { y_true: [1, 0, 1, 1, 0, 1], y_pred: [1, 0, 0, 1, 0, 1] },
        expected: { precision: 1.0, recall: 0.75, f1: 0.8571 }
      },
      {
        id: 'tc-02',
        description: 'All negative predictions (zero positive flags)',
        input: { y_true: [1, 0, 1], y_pred: [0, 0, 0] },
        expected: { precision: 0.0, recall: 0.0, f1: 0.0 }
      },
      {
        id: 'tc-03',
        description: 'Perfect score (100% agreement)',
        input: { y_true: [1, 1, 0, 0], y_pred: [1, 1, 0, 0] },
        expected: { precision: 1.0, recall: 1.0, f1: 1.0 }
      }
    ],
    hints: [
      'Iterate simultaneously through y_true and y_pred using Python zip().',
      'Watch out for ZeroDivisionError when no positive predictions or true positives occur.',
      'Remember F1 is the harmonic mean: 2 * (P * R) / (P + R).'
    ],
    timeComplexity: 'O(N) where N is length of labels array',
    spaceComplexity: 'O(1) auxiliary space',
    explanation: 'Counts True Positives, False Positives, and False Negatives in a single linear pass, then computes the standard definitions with guard conditions against division by zero.'
  },
  {
    id: 'code-02',
    title: 'Calculate Intersection over Union (IoU) for Bounding Boxes',
    language: 'python',
    difficulty: 'Medium',
    topic: 'Computer Vision',
    description: `Write a function \`compute_iou(boxA, boxB)\` that computes the Intersection over Union (IoU) metric between two 2D bounding boxes.
Each bounding box is represented as a list of four coordinates: \`[x1, y1, x2, y2]\`, where \`(x1, y1)\` is top-left and \`(x2, y2)\` is bottom-right.

Return the IoU score as a float rounded to 4 decimal places. If there is no overlap, return \`0.0\`.`,
    examples: [
      {
        input: 'boxA = [0, 0, 4, 4], boxB = [2, 2, 6, 6]',
        output: '0.1429',
        explanation: 'Intersection box is [2, 2, 4, 4] with area (4-2)*(4-2) = 4. Area A = 16, Area B = 16. Union = 16 + 16 - 4 = 28. IoU = 4 / 28 = 0.1429'
      }
    ],
    starterCode: `def compute_iou(boxA, boxB):
    # boxA: [x1, y1, x2, y2]
    # boxB: [x1, y1, x2, y2]
    # Calculate intersection coordinates
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])
    
    inter_w = max(0, xB - xA)
    inter_h = max(0, yB - yA)
    inter_area = inter_w * inter_h
    
    boxA_area = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
    boxB_area = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])
    
    union_area = boxA_area + boxB_area - inter_area
    if union_area <= 0:
        return 0.0
        
    return round(inter_area / union_area, 4)
`,
    solutionCode: `def compute_iou(boxA, boxB):
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])
    
    interArea = max(0, xB - xA) * max(0, yB - yA)
    boxAArea = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
    boxBArea = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])
    
    unionArea = float(boxAArea + boxBArea - interArea)
    if unionArea == 0:
        return 0.0
    return round(interArea / unionArea, 4)
`,
    testCases: [
      {
        id: 'tc-04',
        description: 'Standard partial overlap',
        input: { boxA: [0, 0, 4, 4], boxB: [2, 2, 6, 6] },
        expected: 0.1429
      },
      {
        id: 'tc-05',
        description: 'Completely identical boxes',
        input: { boxA: [10, 10, 20, 20], boxB: [10, 10, 20, 20] },
        expected: 1.0
      },
      {
        id: 'tc-06',
        description: 'Zero overlap disjoint boxes',
        input: { boxA: [0, 0, 5, 5], boxB: [10, 10, 15, 15] },
        expected: 0.0
      }
    ],
    hints: [
      'The intersection rectangle is defined by max(x1_a, x1_b), max(y1_a, y1_b), min(x2_a, x2_b), and min(y2_a, y2_b).',
      'If min(x2) <= max(x1) or min(y2) <= max(y1), width or height is 0 (use max(0, width)).',
      'Union area = Area(A) + Area(B) - Intersection Area.'
    ],
    timeComplexity: 'O(1) constant time calculation',
    spaceComplexity: 'O(1) constant space',
    explanation: 'Calculates coordinates of overlap rectangle using min/max bounds and divides intersection by the inclusion-exclusion union area.'
  },
  {
    id: 'code-03',
    title: 'Cosine Similarity for Embeddings & Vector Search',
    language: 'python',
    difficulty: 'Easy',
    topic: 'NLP & Generative AI',
    description: `In RAG and vector database retrieval, vector similarity is essential.
Write a function \`cosine_similarity(vec_a, vec_b)\` that takes two lists of equal-length floats and computes their cosine similarity:
$$\\text{similarity} = \\frac{\\mathbf{a} \\cdot \\mathbf{b}}{\\|\\mathbf{a}\\| \\|\\mathbf{b}\\|}$$

Return the value rounded to 4 decimal places. If either vector has a norm of 0, return \`0.0\`.`,
    examples: [
      {
        input: 'vec_a = [1.0, 2.0, 3.0], vec_b = [2.0, 4.0, 6.0]',
        output: '1.0',
        explanation: 'Vectors point in the exact same direction (collinear).'
      }
    ],
    starterCode: `import math

def cosine_similarity(vec_a, vec_b):
    # Calculate dot product
    dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
    
    # Calculate magnitudes
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))
    
    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
        
    return round(dot_product / (norm_a * norm_b), 4)
`,
    solutionCode: `import math

def cosine_similarity(vec_a, vec_b):
    dot = sum(x * y for x, y in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(x * x for x in vec_a))
    norm_b = math.sqrt(sum(y * y for y in vec_b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return round(dot / (norm_a * norm_b), 4)
`,
    testCases: [
      {
        id: 'tc-07',
        description: 'Collinear positive vectors',
        input: { vec_a: [1.0, 2.0, 3.0], vec_b: [2.0, 4.0, 6.0] },
        expected: 1.0
      },
      {
        id: 'tc-08',
        description: 'Orthogonal vectors (90 degree angle)',
        input: { vec_a: [1.0, 0.0], vec_b: [0.0, 1.0] },
        expected: 0.0
      },
      {
        id: 'tc-09',
        description: 'Opposite vectors (180 degree angle)',
        input: { vec_a: [1.0, 1.0], vec_b: [-1.0, -1.0] },
        expected: -1.0
      }
    ],
    hints: [
      'Dot product is sum of pairwise products.',
      'Euclidean norm (L2) is sqrt of sum of squares.',
      'Guards against zero-norm division are critical.'
    ],
    timeComplexity: 'O(D) where D is embedding dimensionality',
    spaceComplexity: 'O(1) auxiliary space',
    explanation: 'Computes inner product divided by product of Euclidean norms, representing the cosine of the angle between two semantic embedding vectors.'
  },
  {
    id: 'code-04',
    title: 'SQL: Find Monthly Active Users and Retention Rate',
    language: 'sql',
    difficulty: 'Medium',
    topic: 'SQL & Data Handling',
    description: `Given a table \`user_activity\` with columns \`(user_id INT, activity_date DATE)\`, write a SQL query to identify for each month:
1. \`activity_month\`: The start date or formatted month \`YYYY-MM\`
2. \`active_users\`: Count of distinct active users in that month
3. \`retained_users\`: Count of users who were also active in the immediately preceding month.

Use standard SQL with Common Table Expressions (CTEs) or window functions.`,
    examples: [
      {
        input: 'user_activity table with user logins across Jan, Feb, Mar',
        output: 'activity_month | active_users | retained_users',
        explanation: 'Shows retention month-over-month cohort analysis.'
      }
    ],
    starterCode: `-- Write your SQL query below
WITH monthly_users AS (
    SELECT DISTINCT
        user_id,
        DATE_TRUNC('month', activity_date) AS activity_month
    FROM user_activity
),
user_history AS (
    SELECT
        user_id,
        activity_month,
        LAG(activity_month, 1) OVER (
            PARTITION BY user_id 
            ORDER BY activity_month
        ) AS prev_month
    FROM monthly_users
)
SELECT
    activity_month,
    COUNT(DISTINCT user_id) AS active_users,
    COUNT(DISTINCT CASE 
        WHEN prev_month = activity_month - INTERVAL '1 month' 
        THEN user_id 
    END) AS retained_users
FROM user_history
GROUP BY activity_month
ORDER BY activity_month;
`,
    solutionCode: `WITH monthly_users AS (
    SELECT DISTINCT
        user_id,
        DATE_TRUNC('month', activity_date) AS activity_month
    FROM user_activity
),
user_history AS (
    SELECT
        user_id,
        activity_month,
        LAG(activity_month, 1) OVER (
            PARTITION BY user_id 
            ORDER BY activity_month
        ) AS prev_month
    FROM monthly_users
)
SELECT
    activity_month,
    COUNT(DISTINCT user_id) AS active_users,
    COUNT(DISTINCT CASE 
        WHEN prev_month = activity_month - INTERVAL '1 month' 
        THEN user_id 
    END) AS retained_users
FROM user_history
GROUP BY activity_month
ORDER BY activity_month;`,
    testCases: [
      {
        id: 'tc-10',
        description: 'Validates SQL CTE syntax and LAG partition logic',
        input: { query: 'SELECT ... LAG(activity_month) OVER (PARTITION BY user_id)' },
        expected: 'Valid SQL AST with Window Functions'
      }
    ],
    hints: [
      'Deduplicate user logins per month first using DATE_TRUNC or strftime.',
      'Use LAG(activity_month) partitioned by user_id to find the previous active month.',
      'Check if the previous month equals current month minus 1 month.'
    ],
    timeComplexity: 'O(N log N) due to partition sorting',
    spaceComplexity: 'O(N) for window buffers',
    explanation: 'Uses CTE deduplication followed by LAG() analytical window function to track user continuity between consecutive months.'
  }
];
