import React, { useState, useContext } from 'react'
import { useHttp } from '../hooks/http.hook'
import { Toast } from 'react-bootstrap'
import { AuthContext } from '../context/AuthContext'
import './index.css'

const AuthPage = () => {
	const auth = useContext(AuthContext)

	const [succsess, setSuccsess] = useState(false);
	const [errorMess, setError] = useState(false);

	const { loading, request, error } = useHttp()
	const [form, setForm] = useState({
		email: '',
		password: ''
	})

	const changeHandler = event => {
		setForm({
			...form,
			[event.target.name]: event.target.value
		})
	}

	const registerHandler = async () => {
		try {
			const data = await request('/api/auth/register', 'POST', { ...form })
			console.log('data', data)
			setSuccsess(true)
		} catch (error) {
			setError(true)
		}
	}

	const loginHandler = async () => {
		try {
			const data = await request('/api/auth/login', 'POST', { ...form })
			auth.login(data.token, data.userId)
			setSuccsess(true)
		} catch (error) {
			setError(true)
		}
	}

	return (
		<div className="row align-items-center justify-content-center">
			<div className='col-sm-6 align-self-center'>
				<div className="card">
					<div className="card-body">
						<h5 className="card-title">Сократи ссылку</h5>

						<div className="form-group">
							<label htmlFor="exampleInputEmail1">Email</label>
							<input
								type="email"
								placeholder="Введите Email"
								className="form-control"
								id="exampleInputEmail1"
								aria-describedby="emailHelp"
								onChange={changeHandler}
								name="email"

							/>
							<small
								id="emailHelp"
								className="form-text text-muted"
							>
								We'll never share your email with anyone else.
							 </small>
						</div>

						<div className="form-group">
							<label htmlFor="password">Password</label>
							<input
								type="password"
								placeholder="Введите пароль"
								className="form-control"
								onChange={changeHandler}
								id="password"
								name="password"

							/>
						</div>

						<button
							className="btn btn-primary log-in"
							disabled={loading}
							onClick={loginHandler}
						>
							Войти
						</button>
						<button
							className="btn btn-info"
							onClick={registerHandler}
							disabled={loading}
						>
							Регистрация
						</button>

						<Toast onClose={() => setError(false)} show={errorMess} delay={2000} autohide>
							<Toast.Body>{error}</Toast.Body>
						</Toast>
						<Toast onClose={() => setSuccsess(false)} show={succsess} delay={2000} autohide>
							<Toast.Body>User succsessfully created</Toast.Body>
						</Toast>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AuthPage
