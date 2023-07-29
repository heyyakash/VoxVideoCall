package manager

import (
	"sync"
	client "videocallapp/client"
)

type manager struct {
	rooms map[string][]client.Client
	Mutex sync.RWMutex
}
