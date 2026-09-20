export type LessonGuide = {
  why: string;
  keyIdeas: string[];
  fullExample: string;
  walkthrough: string[];
  mistakes: string[];
  practice: { level: string; title: string; task: string }[];
};

const practice = (guided: string, independent: string, interview: string) => [
  { level: 'Guided', title: 'Change one thing', task: guided },
  { level: 'Independent', title: 'Build it yourself', task: independent },
  { level: 'Interview', title: 'Explain your decision', task: interview },
];

export const moduleGuides: Record<string, LessonGuide> = {
  data: {
    why: 'Most model failures begin in the dataset, not the algorithm. A repeatable inspection and cleaning workflow makes every later result more trustworthy.',
    keyIdeas: ['Rows are observations; columns are variables.', 'Inspect shape, types, missingness and duplicates before changing data.', 'Visualise distributions and relationships before selecting a model.', 'Keep the target separate and never use future information as a feature.'],
    fullExample: `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.read_csv("customers.csv")
print(df.shape)
print(df.info())
print(df.isna().sum().sort_values(ascending=False))

df = df.drop_duplicates()
df["age"] = df["age"].fillna(df["age"].median())
df["region"] = df["region"].str.strip().str.title()

sns.histplot(data=df, x="monthly_spend", hue="churned")
plt.show()

X = df.drop(columns=["customer_id", "churned"])
y = df["churned"]
print(X.shape, y.shape)`,
    walkthrough: ['Load without silently changing the source file.', 'Audit structure and missing values before cleaning.', 'Remove exact duplicate observations and document the choice.', 'Use a robust median for skewed numeric missingness.', 'Finish with an explicit feature matrix and target vector.'],
    mistakes: ['Cleaning the full dataset differently from production data.', 'Treating an identifier as a useful numeric feature.', 'Filling missing values before the train/test split.', 'Making charts without labels or a question they answer.'],
    practice: practice('Change the fill strategy and compare the resulting distribution.', 'Create a reusable audit function that reports types, missingness, duplicates and unique values.', 'Explain why an apparently predictive customer ID is probably leakage or memorisation.'),
  },
  stats: {
    why: 'Statistics helps you separate real signal from random variation and communicate how certain—or uncertain—your conclusions are.',
    keyIdeas: ['Use median and IQR for heavily skewed data.', 'A distribution contains more information than one average.', 'Correlation measures association, not causation.', 'State the null hypothesis and significance level before running a test.'],
    fullExample: `import pandas as pd
import seaborn as sns
from scipy import stats

df = pd.read_csv("customers.csv")
print(df["monthly_spend"].describe())

q1, q3 = df["monthly_spend"].quantile([0.25, 0.75])
iqr = q3 - q1
outliers = df[(df.monthly_spend < q1 - 1.5*iqr) |
              (df.monthly_spend > q3 + 1.5*iqr)]

active = df.loc[df.churned == 0, "monthly_spend"].dropna()
churned = df.loc[df.churned == 1, "monthly_spend"].dropna()
t_stat, p_value = stats.ttest_ind(active, churned, equal_var=False)
print({"t": t_stat, "p": p_value, "outliers": len(outliers)})`,
    walkthrough: ['Describe centre, spread and range.', 'Use IQR to flag—not automatically delete—unusual values.', 'Split the two groups being compared.', 'Run Welch’s t-test when group variances may differ.', 'Interpret the p-value alongside effect size and context.'],
    mistakes: ['Calling a non-significant result proof that no effect exists.', 'Removing every outlier automatically.', 'Testing many hypotheses and reporting only the smallest p-value.', 'Confusing statistical significance with practical importance.'],
    practice: practice('Compare mean and median after adding one extreme value.', 'Test whether satisfaction differs between churn groups and write a plain-English conclusion.', 'Explain p-value, confidence interval and effect size without using formulas.'),
  },
  core: {
    why: 'A reliable experiment design matters more than a complicated model. Correct splitting and validation tell you whether learning will generalise.',
    keyIdeas: ['Choose regression or classification from the target.', 'Keep a final test set untouched until model selection is finished.', 'Stratify classification splits when classes are imbalanced.', 'Use cross-validation to measure performance variability.'],
    fullExample: `from sklearn.model_selection import train_test_split, cross_validate
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, stratify=y, random_state=42
)

baseline = DummyClassifier(strategy="most_frequent")
model = LogisticRegression(max_iter=1000)

scores = cross_validate(
    model, X_train, y_train, cv=5,
    scoring=["accuracy", "f1", "roc_auc"],
    return_train_score=True
)
print(scores["test_f1"].mean(), scores["test_f1"].std())`,
    walkthrough: ['Split once with a reproducible random state.', 'Build a naïve baseline before a learned model.', 'Run multiple validation folds only on training data.', 'Compare training and validation scores for overfitting.', 'Report the mean and variability, not only the best fold.'],
    mistakes: ['Using the test set repeatedly during model selection.', 'Reporting accuracy without checking class balance.', 'Skipping the baseline.', 'Changing random seeds until the score looks good.'],
    practice: practice('Change the test size and observe class proportions.', 'Compare a dummy baseline with a logistic model using five-fold CV.', 'Describe underfitting and overfitting using train and validation evidence.'),
  },
  algorithms: {
    why: 'Different algorithms make different assumptions. Comparing them fairly teaches you when simplicity, interpretability or predictive power matters most.',
    keyIdeas: ['Linear models are strong, interpretable baselines.', 'Trees model nonlinear rules without scaling.', 'Distance and margin models usually require scaling.', 'Ensembles reduce variance or correct previous errors.'],
    fullExample: `from sklearn.model_selection import cross_validate
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
from sklearn.neighbors import KNeighborsClassifier

models = {
    "logistic": make_pipeline(StandardScaler(), LogisticRegression()),
    "knn": make_pipeline(StandardScaler(), KNeighborsClassifier()),
    "forest": RandomForestClassifier(n_estimators=300, random_state=42),
    "boosting": HistGradientBoostingClassifier(random_state=42),
}

results = {}
for name, model in models.items():
    cv = cross_validate(model, X_train, y_train, cv=5,
                        scoring="roc_auc", n_jobs=-1)
    results[name] = (cv["test_score"].mean(), cv["test_score"].std())
print(sorted(results.items(), key=lambda x: x[1][0], reverse=True))`,
    walkthrough: ['Define candidates in one comparable collection.', 'Give scaling only to algorithms that need it.', 'Use identical folds and scoring for every model.', 'Record both average score and stability.', 'Choose using performance, latency and interpretability together.'],
    mistakes: ['Comparing models on different data splits.', 'Scaling before cross-validation instead of inside a pipeline.', 'Selecting only from the highest single score.', 'Assuming the most complex model is automatically best.'],
    practice: practice('Add a decision tree and compare its variance across folds.', 'Create a DataFrame leaderboard with score, fit time and prediction time.', 'Defend a simpler model when its score is slightly below the winner.'),
  },
  evaluation: {
    why: 'A model score is useful only when it reflects the cost of real mistakes. Evaluation connects predictions to product or business decisions.',
    keyIdeas: ['MAE is interpretable; RMSE penalises large regression errors.', 'Precision measures positive prediction quality; recall measures coverage.', 'F1 balances precision and recall.', 'ROC-AUC measures ranking, while a threshold creates decisions.'],
    fullExample: `from sklearn.metrics import (
    classification_report, ConfusionMatrixDisplay,
    roc_auc_score, precision_recall_curve
)
import matplotlib.pyplot as plt

prob = model.predict_proba(X_test)[:, 1]
pred = (prob >= 0.35).astype(int)

print(classification_report(y_test, pred))
print("ROC-AUC:", roc_auc_score(y_test, prob))
ConfusionMatrixDisplay.from_predictions(y_test, pred)
plt.show()

precision, recall, thresholds = precision_recall_curve(y_test, prob)
print("Review false negatives before choosing the final threshold.")`,
    walkthrough: ['Generate probabilities before hard labels.', 'Choose a threshold based on error costs.', 'Read the confusion matrix in raw counts.', 'Inspect ranking performance separately with ROC-AUC.', 'Review individual mistakes for patterns.'],
    mistakes: ['Using accuracy for a severely imbalanced target.', 'Tuning the threshold on the test set.', 'Reporting metrics without a baseline.', 'Ignoring the examples the model gets wrong.'],
    practice: practice('Try thresholds 0.3, 0.5 and 0.7 and compare precision/recall.', 'Write an evaluation function returning all core classification metrics.', 'Explain when PR-AUC is more informative than ROC-AUC.'),
  },
  pipelines: {
    why: 'Pipelines make training and prediction reproducible. They ensure every transformation is learned only from allowed training data.',
    keyIdeas: ['Impute before scaling numeric data.', 'One-hot encode unordered categories.', 'Use ColumnTransformer for column-specific operations.', 'Persist the complete fitted pipeline with its schema and version.'],
    fullExample: `import joblib
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression

numeric_pipe = Pipeline([
    ("impute", SimpleImputer(strategy="median")),
    ("scale", StandardScaler()),
])
category_pipe = Pipeline([
    ("impute", SimpleImputer(strategy="most_frequent")),
    ("encode", OneHotEncoder(handle_unknown="ignore")),
])
prep = ColumnTransformer([("num", numeric_pipe, numeric_cols),
                          ("cat", category_pipe, category_cols)])
pipeline = Pipeline([("prep", prep), ("model", LogisticRegression())])
pipeline.fit(X_train, y_train)
joblib.dump(pipeline, "churn_pipeline.joblib")`,
    walkthrough: ['Separate columns by transformation need.', 'Build one pipeline per feature family.', 'Combine them with ColumnTransformer.', 'Attach the estimator as the final step.', 'Fit and save one complete production object.'],
    mistakes: ['Calling get_dummies separately on train and test.', 'Fitting a scaler before cross-validation.', 'Saving only the estimator.', 'Failing on unseen categories in production.'],
    practice: practice('Add a constant-value imputer and compare the feature output.', 'Build a RandomizedSearchCV around the entire pipeline.', 'Explain exactly how Pipeline prevents validation leakage.'),
  },
  unsupervised: {
    why: 'Unsupervised learning explores structure when no target exists. It is useful for discovery, compression and customer segmentation.',
    keyIdeas: ['Scale features before distance-based clustering.', 'Compare several cluster counts.', 'Use PCA for projection, not automatic truth.', 'Evaluate clusters with metrics and domain usefulness.'],
    fullExample: `from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score
import pandas as pd

X_scaled = StandardScaler().fit_transform(X_numeric)
for k in range(2, 7):
    labels = KMeans(n_clusters=k, n_init="auto", random_state=42).fit_predict(X_scaled)
    print(k, silhouette_score(X_scaled, labels))

labels = KMeans(n_clusters=3, n_init="auto", random_state=42).fit_predict(X_scaled)
points = PCA(n_components=2).fit_transform(X_scaled)
plot_df = pd.DataFrame({"pc1": points[:,0], "pc2": points[:,1], "cluster": labels})`,
    walkthrough: ['Choose meaningful numeric inputs.', 'Scale so one unit does not dominate distance.', 'Compare plausible k values.', 'Fit the selected clustering model.', 'Profile and name clusters using original features.'],
    mistakes: ['Including IDs in clustering.', 'Treating a PCA plot as complete proof.', 'Choosing k from one metric alone.', 'Giving clusters labels without inspecting their profiles.'],
    practice: practice('Compare cluster assignments before and after scaling.', 'Create a cluster profile table using groupby means.', 'Explain why useful business segments may not maximise silhouette score.'),
  },
  deep: {
    why: 'Neural networks learn flexible representations, but they require careful validation, regularisation and enough useful data to outperform simpler models.',
    keyIdeas: ['Layers combine weighted inputs and nonlinear activations.', 'Loss defines what the network learns to minimise.', 'Validation curves reveal overfitting.', 'Always compare against a traditional baseline.'],
    fullExample: `import tensorflow as tf
from tensorflow import keras

model = keras.Sequential([
    keras.layers.Input(shape=(X_train.shape[1],)),
    keras.layers.Dense(64, activation="relu"),
    keras.layers.Dropout(0.25),
    keras.layers.Dense(32, activation="relu"),
    keras.layers.Dense(1, activation="sigmoid"),
])
model.compile(optimizer="adam", loss="binary_crossentropy",
              metrics=[keras.metrics.AUC(name="auc")])
stop = keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True)
history = model.fit(X_train, y_train, validation_split=.2,
                    epochs=100, batch_size=32, callbacks=[stop])
print(model.evaluate(X_test, y_test))`,
    walkthrough: ['Define an input matching the transformed feature count.', 'Use nonlinear hidden layers and regularisation.', 'Choose a loss matching classification.', 'Stop when validation performance stops improving.', 'Evaluate once on the test set.'],
    mistakes: ['Using a neural network without a baseline.', 'Training on unscaled numeric features.', 'Choosing epochs from test performance.', 'Reading accuracy while ignoring class imbalance.'],
    practice: practice('Change dropout from 0 to 0.5 and compare validation curves.', 'Plot training and validation loss and identify the best epoch.', 'Explain why deep learning may lose to boosting on small tabular data.'),
  },
  genai: {
    why: 'NLP and GenAI systems become useful when retrieval, prompts, evaluation and safety are designed as one measurable pipeline.',
    keyIdeas: ['Embeddings represent semantic similarity.', 'Chunking controls what can be retrieved.', 'RAG grounds answers in selected context.', 'Evaluate retrieval and final answers separately.'],
    fullExample: `from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

docs = [
    "Refunds are available within 30 days.",
    "Premium plans include priority support.",
    "Passwords can be reset from account settings.",
]
model = SentenceTransformer("all-MiniLM-L6-v2")
doc_vectors = model.encode(docs)

question = "How quickly can I request my money back?"
query_vector = model.encode([question])
scores = cosine_similarity(query_vector, doc_vectors)[0]
context = docs[scores.argmax()]
prompt = f"Answer only from this context: {context}\nQuestion: {question}"
print(prompt)`,
    walkthrough: ['Split trustworthy source material into useful chunks.', 'Embed documents and the query with the same model.', 'Rank chunks by semantic similarity.', 'Place the best context inside a grounded prompt.', 'Test answer correctness and citation support.'],
    mistakes: ['Treating similarity as proof of correctness.', 'Retrieving chunks without source metadata.', 'Evaluating only friendly demo questions.', 'Allowing an agent broad tools without approval boundaries.'],
    practice: practice('Add two documents and inspect how rankings change.', 'Create ten questions with expected source chunks and calculate retrieval hit rate.', 'Explain the difference between an LLM, RAG system and tool-using agent.'),
  },
  mlops: {
    why: 'A trained model creates value only when it can be served, tested, observed and updated safely in a repeatable production workflow.',
    keyIdeas: ['Load the model once when the API starts.', 'Validate every prediction request.', 'Package dependencies and runtime with Docker.', 'Use CI to test code and monitor data plus model behaviour after release.'],
    fullExample: `# api.py
from fastapi import FastAPI
from pydantic import BaseModel
import joblib

app = FastAPI(title="Churn prediction API")
model = joblib.load("churn_pipeline.joblib")

class Customer(BaseModel):
    age: int
    monthly_spend: float
    region: str

@app.get("/health")
def health(): return {"status": "ok"}

@app.post("/predict")
def predict(customer: Customer):
    row = [customer.model_dump()]
    probability = model.predict_proba(row)[0, 1]
    return {"churn_probability": round(float(probability), 4)}

# uvicorn api:app --reload
# docker build -t churn-api .
# docker run -p 8000:8000 churn-api`,
    walkthrough: ['Load the saved pipeline at application startup.', 'Define a typed request contract.', 'Expose health and prediction endpoints.', 'Return a stable JSON response.', 'Containerise and test the endpoint in CI.'],
    mistakes: ['Loading the model for every request.', 'Accepting unvalidated dictionaries.', 'Committing secrets or model credentials.', 'Deploying without health checks, logs or drift monitoring.'],
    practice: practice('Add a validation rule that rejects negative monthly spend.', 'Build a Streamlit form that calls the API and displays probability.', 'Describe a CI/CD and monitoring plan from git push to production alert.'),
  },
};
