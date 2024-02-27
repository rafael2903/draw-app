import { ZoomEvent, ZoomService } from './ZoomService'

export class ZoomUIService {
    constructor(
        private zoomService: ZoomService,
        private scaleDisplay: HTMLButtonElement,
        private zoomOutButton: HTMLButtonElement,
        private zoomInButton: HTMLButtonElement
    ) {
        this.zoomService.on('change', (e) => this.updateButtons(e))
    }

    private updateButtons({ scale, canZoomIn, canZoomOut }: ZoomEvent) {
        this.scaleDisplay.innerText = `${Math.round(scale * 100)}%`
        this.zoomOutButton.disabled = !canZoomOut
        this.zoomInButton.disabled = !canZoomIn
    }

    onZoomInPress() {
        this.zoomService.zoomIn()
        this.zoomInButton.classList.add('pressed')
    }

    onZoomOutPress() {
        this.zoomService.zoomOut()
        this.zoomOutButton.classList.add('pressed')
    }

    onZoomInRelease() {
        this.zoomInButton.classList.remove('pressed')
    }

    onZoomOutRelease() {
        this.zoomOutButton.classList.remove('pressed')
    }

    onResetPress() {
        this.zoomService.reset()
        this.scaleDisplay.classList.add('pressed')
    }

    onResetRelease() {
        this.scaleDisplay.classList.remove('pressed')
    }
}
