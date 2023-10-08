"""
Special topic. Not intended to be sent to anything, but is used for 
to indicate that something subscribes to .. everything.

ie: if you have a NetworkBus connection that subscribes to this topic
it will receive all (non addressed) packets regardless of what topic they
were sent to.
"""
extends RefCounted
