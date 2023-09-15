import React, { useEffect, useState } from 'react'
import * as BABYLON from 'babylonjs';
import { Router, Node } from './router';
import { Tracker } from '../network/Tracker';
import { DataChannelHost } from '../network/DataChannelHost';
import { DataChannelState } from '../network/DataChannelShared';


// CreateScene function that creates and return the scene
var createScene = function (canvas: HTMLCanvasElement, engine: BABYLON.Engine) {
    // Create a basic BJS Scene object
    var scene = new BABYLON.Scene(engine);
    // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
    var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
    // Target the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());
    // Attach the camera to the canvas
    camera.attachControl(canvas, false);
    // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
    var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene, false, BABYLON.Mesh.FRONTSIDE);
    // Move the sphere upward 1/2 of its height
    sphere.position.y = 1;
    // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
    var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene, false);
    // Return the created scene
    console.log("Recreate Scene")
    return scene;
}


interface ClientState {
    client_id: number,
    state: DataChannelState,
}

export interface GameState {
    clients: ClientState[],
}


class GameInstance {
    private engine: BABYLON.Engine
    private scene: BABYLON.Scene

    private dataChannelHost: DataChannelHost

    private gameState: GameState = {
        clients: []
    }
    private gameStateSubscribers: ((gameState: GameState) => void)[] = []


    private router: Router = new Router()
    private consoles: Map<number, Node> = new Map()

    constructor(canvas: HTMLCanvasElement) {
        this.engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
        this.scene = createScene(canvas, this.engine)

        this.dataChannelHost = new DataChannelHost()

        this.dataChannelHost.subscribeStateChange((clientId, state) => {
            const index = this.gameState.clients.findIndex((clientState) => clientState.client_id === clientId)
            if (index !== -1) {
                this.gameState.clients[index] = {
                    client_id: clientId,
                    state: state,
                }
            } else {
                this.gameState.clients.push({
                    client_id: clientId,
                    state: state,
                })
            }
            this.gameStateSubscribers.forEach(c => c(this.gameState))
        })

        this.dataChannelHost.subscribeClientMessage((clientId, message) => {
            const c = this.getConsoleForClient(clientId)
            c.toRouter.push(message)
        })

        this.engine.runRenderLoop(() => {
            this.loop()
        })
    }

    private loop() {
        this.router.iterate()
        this.scene.render()

        this.consoles.forEach((c, clientId) => {
            let message = c.fromRouter.pop()
            while (message) {
                this.dataChannelHost.sendMessageToClient(clientId, message)
                message = c.fromRouter.pop()
            }
        })
    }

    private getConsoleForClient(clientId: number): Node {
        let console = this.consoles.get(clientId)
        if (!console) {
            const console = this.router.createNode()
            this.consoles.set(clientId, console)
            return console
        }
        return console
    }

    public subscribeGameState(callback: (gameState: GameState) => void): () => void {
        this.gameStateSubscribers.push(callback)
        return () => {
            this.gameStateSubscribers = this.gameStateSubscribers.filter(c => c !== callback)
        }
    }

    public setTracker(tracker: Tracker): () => void {
        return this.dataChannelHost.setTracker(tracker)
    }


    public resize() {
        this.engine.resize()
    }

    public destroy() {
        this.engine.stopRenderLoop()
        this.scene.dispose()
        this.engine.dispose()
    }

}





export const Game: React.FC<{ tracker: Tracker, setGameState: (state: GameState) => void }> = ({ tracker, setGameState }) => {
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)

    const [game, setGame] = useState<GameInstance | undefined>(undefined)

    useEffect(() => {
        if (!canvas) {
            return
        }
        const g = new GameInstance(canvas)
        setGame(g)
        return () => {
            setGame(undefined)
            g.destroy()
        }
    }, [canvas])

    useEffect(() => {
        const resize = () => {
            if (game) {
                game.resize()
            }
        }

        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [game])

    useEffect(() => {
        if (!game) {
            return () => { };
        }
        return game.setTracker(tracker)
    }, [game, tracker])

    useEffect(() => {
        if (!game) {
            return () => { };
        }
        return game.subscribeGameState(setGameState)
    }, [game, setGameState])


    return <canvas ref={newRef => setCanvas(newRef)} className="w-100 h-100 m-0 p-0" />
}


