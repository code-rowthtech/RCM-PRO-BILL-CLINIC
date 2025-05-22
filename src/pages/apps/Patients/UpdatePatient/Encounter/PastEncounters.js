import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { getEncounterAction } from '../../../../../redux/actions'
import { useSelector } from 'react-redux'

const PastEncounters = () => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id')
    const store = useSelector((state) => state);
    const encountersData = store?.getEncounterReducer?.data?.encounter;

    useEffect(() => {
        dispatch(getEncounterAction({ patientId: id, status: 'finished' }))
    }, [dispatch, id])
    return (
        <div className=''>

        </div>
    )
}

export default PastEncounters