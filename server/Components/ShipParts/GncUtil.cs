using Godot;
using System;
using MathNet.Numerics.LinearAlgebra;

using GodotMatrixType = Godot.Collections.Array<Godot.Collections.Array<float>>;

public partial class GncUtil : Node
{
	// Inverts a matrix using the pseudo inverse method
	public GodotMatrixType PseudoInverse(GodotMatrixType mat)
	{

		Matrix<float> m = Matrix<float>.Build.DenseOfColumns(mat);
		Matrix<float> inv = m.PseudoInverse();

		GodotMatrixType invMat = new GodotMatrixType();
		for (int i = 0; i < inv.RowCount; i++)
		{
			Godot.Collections.Array<float> row = new Godot.Collections.Array<float>();
			for (int j = 0; j < inv.ColumnCount; j++)
			{
				row.Add(inv[i, j]);
			}
			invMat.Add(row);
		}

		return invMat;
	}


	// Solve for the forces for all thrusters given desired forces/torque on the spaceship (given as vec3), and the kinematics matrixes
	// This is done iteratively by using the IK matrix as an initial guess and then using the jacobian to iterate towards a solution
	public Godot.Collections.Array<float> SolveForces(Godot.Vector3 desiredForce, Godot.Vector3 desiredTorque, GodotMatrixType kinematicsMatrix, GodotMatrixType kinematicsMatrixInverse)
	{
		// Convert the desired forces and torque to a single vector
		Vector<float> desired = Vector<float>.Build.DenseOfArray(new float[] { desiredForce.X, desiredForce.Y, desiredForce.Z, desiredTorque.X, desiredTorque.Y, desiredTorque.Z });

		int numThrusters = kinematicsMatrixInverse.Count;
		
		// Load the matrices
		Matrix<float> kinematics = Matrix<float>.Build.DenseOfColumns(kinematicsMatrix);
		Matrix<float> kinematicsInv = Matrix<float>.Build.DenseOfColumns(kinematicsMatrixInverse).Transpose();

		// Initial guess for the forces
		Vector<float> guess = Vector<float>.Build.Dense(numThrusters, 0);

		// Iterate to find the forces
		// Ideally should iterate till convergence, but as this is a game, constant time is probably good enough.
		for (int i = 0; i < 10; i++) { 
			// Calculate the jacobian
			// This approximation is true only because the thrusters are independant.
			// (ie the output of one thruster does not change the output or direction of another thruster)
			Matrix<float> jacobianInv = kinematicsInv;

			Vector<float> thrustOutput = kinematics * guess;
			Vector<float> thrustError = desired - thrustOutput;

			// Calculate the change in forces
			Vector<float> deltaForces = jacobianInv * thrustError;
			guess += deltaForces;

			// Thrusters can't pull and are scaled from 0-1, so clamp them
			for (int j = 0; j < guess.Count; j++)
			{
				guess[j] = Mathf.Clamp(guess[j], 0, 1);
			}
		}

		return floatVectorToGodotArray(guess);
	}

	// Often we want to specify inputs in terms of percent of peak performance.
	// This function takes in the target forces as a percentage of peak performance and scales thruster outputs to try match without saturating.
	// Input vectors should be between -1 and 1
	public Godot.Collections.Array<float> ComputeThrustForPercentMotion(Godot.Vector3 desiredForce, Godot.Vector3 desiredTorque, GodotMatrixType kinematicsMatrix, GodotMatrixType kinematicsMatrixInverse)
	{

		// If we assume that the craft can apply a very very small force in a certain direction
		// we can extract the relative thruster percentages.
		// If this number is large, then the vehicle may not be able to apply it, so there
		// may be unexpected results. A smaller EPS potentially results in more accurate motion
		float EPS = 0.0001f;

		// TODO: Do both force and torque at the same time rather than splitting them out. This will remove a bunch of logic

		Vector<float> targetMotion = Vector<float>.Build.DenseOfArray(new float[] { desiredForce.X, desiredForce.Y, desiredForce.Z, desiredTorque.X, desiredTorque.Y, desiredTorque.Z });
		float targetMotionPercent = (float)targetMotion.L2Norm();
		Vector<float> targetMotionNorm = targetMotion.Normalize(2);

		Vector<float> microMotion = Vector<float>.Build.DenseOfArray(new float[] { 0, 0, 0, 0, 0, 0 });
		if (targetMotionPercent > EPS)
		{
			microMotion = targetMotionNorm.Multiply(EPS);
		}

		// Solve for the forces
		Godot.Collections.Array<float> guessRaw = SolveForces(
			new Godot.Vector3(microMotion[0], microMotion[1], microMotion[2]), 
			new Godot.Vector3(microMotion[3], microMotion[4], microMotion[5]), 
			kinematicsMatrix, 
			kinematicsMatrixInverse
		);
		Vector<float> guess = Vector<float>.Build.DenseOfEnumerable(guessRaw);

		float maxPercent = maximumItemValue(guess);
		if (maxPercent != 0.0f) {
			guess = guess.Multiply(1.0f / maxPercent);
		}
		guess = guess.Multiply(targetMotionPercent);

		// Convert the forces to a Godot array
		return floatVectorToGodotArray(guess);	
	}


	private Godot.Collections.Array<float> floatVectorToGodotArray(Vector<float> vec)
	{
		Godot.Collections.Array<float> arr = new Godot.Collections.Array<float>();
		for (int i = 0; i < vec.Count; i++)
		{
			arr.Add(vec[i]);
		}
		return arr;
	}


	private float maximumItemValue(Vector<float> vec)
	{
		float max = 0;
		for (int i = 0; i < vec.Count; i++)
		{
			if (vec[i] > max)
			{
				max = vec[i];
			}
		}
		return max;
	}
}
