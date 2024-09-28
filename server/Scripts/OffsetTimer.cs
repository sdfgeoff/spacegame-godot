using Godot;
using System;

public partial class OffsetTimer : Node
{
	[Export]
	public double Interval { get; set; } = 1.0;
	
	[Export]
	public double TimeSinceEvent { get; set; } = 0.0;
	
	[Signal]
	public delegate void TimeoutEventHandler();

	// public OffsetTimer(
	// 	double interval
	// )
	// {
	// 	Interval = interval;
	// 	TimeSinceEvent = Interval * GD.Randf();
	// }

	public static OffsetTimer Create(double intv)
	{
		System.Diagnostics.Debug.Assert(intv > 0.0, "Timer intervals must be real positive numbers");
		OffsetTimer timer = new OffsetTimer();
		timer.Interval = intv;
		timer.TimeSinceEvent = intv * GD.Randf();

		return timer;
	}

	// Called every frame. 'delta' is the elapsed time since the previous frame.
	public override void _Process(double delta)
	{
		TimeSinceEvent += delta;
		while (TimeSinceEvent >= Interval)
		{
			EmitSignal(SignalName.Timeout);
			TimeSinceEvent -= Interval;
		}
	}
}
