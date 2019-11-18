import { EventDispatcher, Matrix4, Plane, Raycaster, Vector2, Vector3, Object3D, Camera } from 'three'

class CubeDragControls extends EventDispatcher {
  public enabled = true

  private _objects: Object3D[]
  private _camera: Camera
  private _domElement: HTMLElement

  private _plane = new Plane()
  private _raycaster = new Raycaster()

  private _mouse = new Vector2()
  private _offset = new Vector3()
  private _intersection = new Vector3()
  private _worldPosition = new Vector3()
  private _inverseMatrix = new Matrix4()

  private _selected: Object3D | null = null
  private _hovered: Object3D | null = null

  constructor(objects: Object3D[], camera: Camera, domElement: HTMLElement) {
    super()

    this._objects = objects
    this._domElement = domElement
    this._camera = camera

    console.log(this._domElement)

    this.activate()
  }

  public activate = () => {
    const _domElement = this._domElement

    _domElement.addEventListener('mousemove', this.onDocumentMouseMove)
    _domElement.addEventListener('mousedown', this.onDocumentMouseDown)
    _domElement.addEventListener('mouseup', this.onDocumentMouseCancel)
    _domElement.addEventListener('mouseleave', this.onDocumentMouseCancel)
    _domElement.addEventListener('touchmove', this.onDocumentTouchMove)
    _domElement.addEventListener('touchstart', this.onDocumentTouchStart)
    _domElement.addEventListener('touchend', this.onDocumentTouchEnd)
  }

  public deactivate = () => {
    const _domElement = this._domElement

    _domElement.removeEventListener('mousemove', this.onDocumentMouseMove)
    _domElement.removeEventListener('mousedown', this.onDocumentMouseDown)
    _domElement.removeEventListener('mouseup', this.onDocumentMouseCancel)
    _domElement.removeEventListener('mouseleave', this.onDocumentMouseCancel)
    _domElement.removeEventListener('touchmove', this.onDocumentTouchMove)
    _domElement.removeEventListener('touchstart', this.onDocumentTouchStart)
    _domElement.removeEventListener('touchend', this.onDocumentTouchEnd)
  }

  public dispose = () => {
    this.deactivate()
  }

  private onDocumentMouseMove = (event: MouseEvent) => {
    event.preventDefault()

    const rect = this._domElement.getBoundingClientRect()
    this._mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    this._mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    this._raycaster.setFromCamera(this._mouse, this._camera)

    if (this._selected && this.enabled) {
      if (this._raycaster.ray.intersectPlane(this._plane, this._intersection)) {
        this._selected.position.copy(this._intersection.sub(this._offset).applyMatrix4(this._inverseMatrix))
      }

      this.dispatchEvent({ type: 'drag', object: this._selected })

      return
    }

    this._raycaster.setFromCamera(this._mouse, this._camera)

    const intersects = this._raycaster.intersectObjects(this._objects, false)

    if (intersects.length > 0) {
      const object = intersects[0].object
      this._plane.setFromNormalAndCoplanarPoint(
        this._camera.getWorldDirection(this._plane.normal),
        this._worldPosition.setFromMatrixPosition(object.matrixWorld),
      )

      if (this._hovered !== object) {
        this.dispatchEvent({ type: 'hoveron', object })

        this._domElement.style.cursor = 'pointer'
        this._hovered = object
      }
    } else {
      if (this._hovered !== null) {
        this.dispatchEvent({ type: 'hoveroff', object: this._hovered })

        this._domElement.style.cursor = 'auto'
        this._hovered = null
      }
    }
  }

  private onDocumentMouseDown = (event: MouseEvent) => {
    event.preventDefault()

    this._raycaster.setFromCamera(this._mouse, this._camera)

    const intersects = this._raycaster.intersectObjects(this._objects, false)

    if (intersects.length > 0) {
      this._selected = intersects[0].object

      if (this._raycaster.ray.intersectPlane(this._plane, this._intersection) && this._selected) {
        // Scene
        this._inverseMatrix.getInverse((this._selected.parent as Object3D).matrixWorld)
        this._offset.copy(this._intersection).sub(this._worldPosition.setFromMatrixPosition(this._selected.matrixWorld))
      }

      this._domElement.style.cursor = 'move'

      this.dispatchEvent({ type: 'dragstart', object: this._selected })
    }
  }

  private onDocumentMouseCancel = (event: MouseEvent) => {
    event.preventDefault()

    if (this._selected) {
      this.dispatchEvent({ type: 'dragend', object: this._selected })
      this._selected = null
    }

    this._domElement.style.cursor = this._hovered ? 'pointer' : 'auto'
  }

  private onDocumentTouchMove = (event: TouchEvent) => {
    event.preventDefault()
  }

  private onDocumentTouchStart = (event: TouchEvent) => {
    event.preventDefault()
  }

  private onDocumentTouchEnd = (event: TouchEvent) => {
    event.preventDefault()
  }
}

export default CubeDragControls
