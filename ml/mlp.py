from sklearn.neural_network import MLPClassifier
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
import joblib
import numpy as np

# Split dataset into train and test sets
X_train, X_test, y_train, y_test = train_test_split(
    X_pca, df['jurusan'], test_size=0.2, random_state=42
)

# Train an MLP model
mlp = MLPClassifier(
    hidden_layer_sizes=(128, 64),  # Two hidden layers with 128 and 64 neurons
    activation='relu',            # Activation function
    solver='adam',                # Optimizer
    max_iter=100,                 # Maximum iterations
    random_state=42
)
mlp.fit(X_train, y_train)

# Save the model
joblib.dump(mlp, 'mlp_model.pkl')
print("MLP model saved!")

# Predict and evaluate the model
y_pred = mlp.predict(X_test)
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Test 15 random samples from the dataset
random_indices = np.random.choice(len(df), 20, replace=False)

print("\nVerifikasi 20 Data Acak:")
for i, idx in enumerate(random_indices):
    # Get predicted and actual labels
    cluster_label = df['cluster'].iloc[idx]  # Cluster from KMeans (optional)
    predicted_label = df['predicted_category'].iloc[idx]  # Predicted by MLP
    actual_label = df['jurusan'].iloc[idx]  # Actual label
    print(f"Data {i + 1}: Index: {idx}, Prediksi: {predicted_label}, Sebenarnya: {actual_label}")
